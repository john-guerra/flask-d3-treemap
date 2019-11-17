/* global d3, myTreemap */

function createHierarchy(data, hierarchy) {
  const nest = d3.nest();

  for (let h of hierarchy) {
    nest.key(d => d[h]);
  }
  return nest.entries(data);
}

console.log("Downloading data");

function update() {
  let hierarchy = d3.select("#inHierarchy").property("value");

  try {
    hierarchy = hierarchy.split(",");
  } catch (Exception) {
    hierarchy = [];
  }

  const url =
    "/data" + (hierarchy.length ? "?hierarchy=" + hierarchy.join(",") : "");

  console.log("url", url);
  d3.csv(url).then(data => {
    const treeData = createHierarchy(data, hierarchy);
    console.log("Data loaded", data);
    console.log("treedata", treeData);

    const myTEle = myTreemap(600, treeData);

    d3.select("#chart").html("");
    d3.select("#chart")
      .node()
      .appendChild(myTEle);
  });
}

update();

d3.select("#btnSubmit").on("click", update);
