'use server'

import { S3Client, S3ClientConfig, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { AttributeValue, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'

const s3ClientConfig: S3ClientConfig = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
}
const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_BUCKET_REGION })

if (!process.env.AWS_BUCKET_REGION || !process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('Missing required environment variables')
}

const s3Client = new S3Client(s3ClientConfig)

const allowedFileTypes = ['image/png', 'image/jpeg']

export async function uploadImages(formData: FormData) {
  try {
    const files = formData.getAll('file')
    let description = formData.get('description')

    if (typeof description !== 'string') {
      description = ''
    }

    const uploadAttempts = await Promise.allSettled(
      Array.from(files).map(async (file: any) => {
        let valid_type = false
        for (const attribute in file) {
          if (attribute === 'type' && allowedFileTypes.includes(file.type)) {
            valid_type = true
            break
          }
        }
        if (!valid_type) throw new Error(`Invalid type: ${file.type}`)
        const key = randomUUID()
        const putObjectCommand = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
        })
        const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
          expiresIn: 60,
        })
        const response = await fetch(signedUrl, {
          method: 'PUT',
          body: file,
        })
        if (!response.ok) throw new Error(`Upload failed with status ${response.status}`)
        const putItemCommand = new PutItemCommand({
          TableName: process.env.DYNAMODB_TABLE_NAME!,
          Item: {
            'FileKey': { S: key }, // PK
            'FileType': { S: file.type },
            'uploadDate': { S: new Date().getTime().toString() }, // Sort key
            'description': { S: description },
          },
        })
        await dynamoDbClient.send(putItemCommand)
      })
    )
    const failures = uploadAttempts.filter(({ status }) => status === 'rejected' ).length
    if (files.length === failures) {
      console.log(failures)
    }
    if (failures > 0) {
      console.log(`${failures} image${failures === 1 ? '' : 's'} failed to upload.`)
    }
    const successfulUploads = uploadAttempts.filter(({ status }) => status === 'fulfilled' )
    console.log(`${successfulUploads.length} image${successfulUploads.length === 1 ? '' : 's'} uploaded successfully.`)
    revalidatePath('/')
  } catch (e) {
    console.log(`Error: ${e}`)
  }
}

export async function fetchImages() {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME!,
  })

  try {
    const { Contents } = await s3Client.send(command)
    
    const promises = Contents?.map(async (file) => {
      if (typeof file.Key === 'string') {
        const metadataCommand = new GetItemCommand({
          TableName: process.env.DYNAMODB_TABLE_NAME!,
          Key: {
            'FileKey': { S: file.Key },
          },
        })

        const metadataResult = await dynamoDbClient.send(metadataCommand)
        return {
          imageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${file.Key}`,
          metadata: metadataResult.Item,
        }
      } else {
        throw new Error(`Invalid key: ${file.Key}`)
      }
    }) || []

    const results = await Promise.allSettled(promises)

    const imageData = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<{ imageUrl: string; metadata: Record<string, AttributeValue> | undefined; }>).value)
      .map( result => {
        return {
          url: result.imageUrl,
          type: String(result.metadata?.type),
          uploadDate: String(result.metadata?.uploadDate),
          description: String(result.metadata?.description),
        }
      })

    return { images: imageData }
  } catch (error) {
    console.error('Error fetching images:', error)
    return { severity: 'error', message: 'Error fetching images' }
  }
}

export async function handleDelete(url: string) {
  const fileKey = url.split('/').pop()

  if (!fileKey) {
    console.log(`Invalid url: ${url}`)
    return
  }

  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
  })

  await s3Client.send(deleteObjectCommand)

  const deleteItemCommand = new DeleteItemCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME!,
    Key: {
      'FileKey': { S: fileKey },
    },
  })

  await dynamoDbClient.send(deleteItemCommand)
}
