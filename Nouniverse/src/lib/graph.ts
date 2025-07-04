export async function graphQuery<T = any>(
    query: string,
    variables: Record<string, any> = {},
    endpoint: string = "https://api.goldsky.com/api/public/project_cldf2o9pqtjbm49vm6ebkw02y/subgraphs/nouns-subgraph/prod/gn"
): Promise<T> {
    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
        console.error('GraphQL errors:', json.errors);
        throw new Error(json.errors[0]?.message || 'GraphQL query failed');
    }

    return json.data;
}