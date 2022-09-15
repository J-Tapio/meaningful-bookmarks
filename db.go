package main

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

/*
Referencing
https://www.mongodb.com/blog/post/quick-start-golang-mongodb-starting-and-setup
*/

type MongoDb struct {
	client     *mongo.Client
	collection *mongo.Collection
	dbInitErr  bool
	dbConnErr  bool
}

// Initializes MongoDb client and collection
func InitDb(db *MongoDb) {
	// Initialize client
	var clientErr error
	db.client, clientErr = mongo.NewClient(options.Client().ApplyURI(os.Getenv("MONGODB_URI")))

	if clientErr != nil {
		fmt.Printf("Error while initializing Mongo client, error:%s\n", clientErr)
		db.dbInitErr = true
	}

	// Connect to db
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	connectionErr := db.client.Connect(ctx)
	if connectionErr != nil {
		fmt.Printf("Error while connecting to database, error:%s\n", connectionErr)
		db.dbConnErr = true
		cancel()
		return
	}

	// Test db connection
	pingErr := db.client.Ping(ctx, readpref.Primary())
	if pingErr != nil {
		fmt.Printf("Error while trying to verify database connection, error: %s\n", pingErr)
		db.dbConnErr = true
		cancel()
		return
	}

	db.collection = db.client.Database("MeaningfulBookmarks").Collection("bookmarks")
	
	fmt.Println("Connected to database")
}

func CloseDb(db *MongoDb) {
	fmt.Println("Closing database connection")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if disconnectErr := db.client.Disconnect(ctx); disconnectErr != nil {
		fmt.Printf("Issue with closing database connection: %s\n", disconnectErr)
		return
	}

	fmt.Println("Database connection closed")
}

func (db *MongoDb) insertNote(a *App, noteDocument NoteDocument) (id primitive.ObjectID, err error) {
	now := time.Now()
	// "imageURL": noteDocument.ImageURL - not provided since updated later with.
	document := bson.M{"pageURL": noteDocument.PageURL, "noteTitle": noteDocument.Title, "note": noteDocument.Note, "tags": noteDocument.Tags, "imageURL": "", "created_at": now.UnixMilli(), "updated_at": now.UnixMilli()}

	result, err := db.collection.InsertOne(context.TODO(), document)

	if err != nil {
		fmt.Printf("Document upload failed: %s\n", err)
		return primitive.NilObjectID, err
	} else {
		return result.InsertedID.(primitive.ObjectID), nil
	}
}

func (db *MongoDb) upsertNoteImg(a *App, id primitive.ObjectID, imageURL string) (err error) {
	update := bson.M{"$set": bson.M{"imageURL": imageURL}}

	result, updateErr := db.collection.UpdateByID(context.TODO(), id, update)
	if updateErr != nil {
		return updateErr
	}

	if result.MatchedCount == 0 {
		return errors.New("id not found")
	}

	return nil
}

// Retrieves all bookmarks. If error, returns empty result and error.
func (db *MongoDb) allBookmarks(a *App) ([]NoteDocument, error) {
	var bookmarks []NoteDocument

	options := options.Find().SetProjection(bson.D{{Key: "_id", Value: 1}, {Key: "noteTitle", Value: 1}, {Key: "pageURL", Value: 1}, {Key: "tags", Value: 1}, {Key: "created_at", Value: 1}}).SetSort(bson.D{{Key: "created_at", Value: -1}})

	cur, findErr := db.collection.Find(context.TODO(), bson.D{}, options)
	cur.All(context.TODO(), &bookmarks)

	//fmt.Printf("Bookmarks: %v+", bookmarks)

	if findErr != nil {
		fmt.Printf("Error while fetching all bookmarks from db: %s\n", findErr)
		return nil, findErr
	}

	return bookmarks, nil
}

// Retrieves bookmark by id. If error, returns empty result and error
func (db *MongoDb) bookmarkById(a *App, noteId string) (*NoteDocument, error) {
	var bookmark *NoteDocument

	objectId, err := primitive.ObjectIDFromHex(noteId)
	if err != nil {
		fmt.Printf("Invalid id provided: %s\n", err)
		return nil, err
	}

	projection := &options.FindOneOptions{Projection: bson.D{
		{Key: "_id", Value: 1},
		{Key: "noteTitle", Value: 1},
		{Key: "pageURL", Value: 1},
		{Key: "imageURL", Value: 1},
		{Key: "note", Value: 1},
		{Key: "tags", Value: 1},
		{Key: "created_at", Value: 1},
	}}

	result := db.collection.FindOne(context.TODO(), bson.D{{Key: "_id", Value: objectId}}, projection)
	result.Decode(&bookmark)

	return bookmark, nil
}