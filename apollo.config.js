module.exports = {
    client: {
        includes: ["**/*.tsx"],
        tagName: "gql",
        service: {
            name: "jetaverse-backend",
            url: `${process.env.NEXT_PUBLIC_API_URL}/graphql`
        }
    }
}