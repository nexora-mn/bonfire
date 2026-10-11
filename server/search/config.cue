// Embedding models need roughly 1 GB of free RAM on the Typesense node.
// Locally that is often not available, so semantic search is off there;
// set a model here to try it.
EmbeddingModel: [
	if #Meta.Environment.Cloud == "local" {""},
	"ts/multilingual-e5-small",
][0]
