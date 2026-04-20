export function dijkstra(graph, start) {

  const distances = {};
  const visited = {};
  const nodes = Object.keys(graph);

  nodes.forEach(node => {
    distances[node] = Infinity;
  });

  distances[start] = 0;

  while (nodes.length) {

    nodes.sort((a,b)=>distances[a]-distances[b]);

    const closest = nodes.shift();

    if(distances[closest] === Infinity) break;

    visited[closest] = true;

    for(let neighbor in graph[closest]){

      let newDistance = distances[closest] + graph[closest][neighbor];

      if(newDistance < distances[neighbor]){
        distances[neighbor] = newDistance;
      }

    }

  }

  return distances;
}