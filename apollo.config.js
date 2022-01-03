module.exports = {
    client: {
        includes: ["**/*.tsx"],
        tagName: "gql",
        service: {
            name: "jetaverse-backend",
            url: "http://localhost:4000/graphql"
        }
    }
}