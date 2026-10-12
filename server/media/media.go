// Package media stores creator images (avatars, covers, post and tier
// images) in the public "creator-media" bucket of Supabase Storage.
//
// Encore's object storage can't be used: its S3 client addresses buckets by
// subdomain, which Supabase's S3 endpoint doesn't serve, so this client
// forces path-style addressing.
package media

import (
	"bytes"
	"context"
	"strings"
	"sync"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

var secrets struct {
	// SUPABASE_URL is the project URL, e.g. https://<ref>.supabase.co.
	SUPABASE_URL string
	// S3 access key pair from Supabase → Storage → S3 Connection.
	STORAGE_ACCESS_KEY_ID     string
	STORAGE_SECRET_ACCESS_KEY string
}

const (
	bucket = "creator-media"
	// The Supabase project's region; S3 requests are signed for it.
	region = "ap-northeast-1"
)

var client = sync.OnceValue(func() *s3.Client {
	return s3.New(s3.Options{
		Region:       region,
		BaseEndpoint: aws.String(projectURL() + "/storage/v1/s3"),
		UsePathStyle: true,
		Credentials:  credentials.NewStaticCredentialsProvider(secrets.STORAGE_ACCESS_KEY_ID, secrets.STORAGE_SECRET_ACCESS_KEY, ""),
	})
})

func projectURL() string {
	return strings.TrimRight(secrets.SUPABASE_URL, "/")
}

// PublicURL is where anyone can download the object.
func PublicURL(key string) string {
	return projectURL() + "/storage/v1/object/public/" + bucket + "/" + key
}

// Upload stores data under key, replacing any object already there.
func Upload(ctx context.Context, key, contentType string, data []byte) error {
	_, err := client().PutObject(ctx, &s3.PutObjectInput{
		Bucket:        aws.String(bucket),
		Key:           aws.String(key),
		Body:          bytes.NewReader(data),
		ContentLength: aws.Int64(int64(len(data))),
		ContentType:   aws.String(contentType),
		// Keys are unique per upload, so the file never changes.
		CacheControl: aws.String("public, max-age=31536000, immutable"),
	})
	return err
}

// Remove deletes the object. A missing object is not an error.
func Remove(ctx context.Context, key string) error {
	_, err := client().DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	})
	return err
}
