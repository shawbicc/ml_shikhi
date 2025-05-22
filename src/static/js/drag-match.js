const correctOrder = [
    "import pandas as pd",
    "df = pd.read_csv('creatures.csv')",
    "print(df.head())"
  ];

  let shuffledOrder = [...correctOrder].sort(() => Math.random() - 0.5);
  const container = document.getElementById("code-list");

  let dragSrcEl = null;

  function renderList(items) {
    container.innerHTML = "";
    items.forEach((line, index) => {
      const div = document.createElement("div");
      div.className = "draggable";
      div.draggable = true;
      div.textContent = line;
      div.dataset.index = index;

      div.addEventListener("dragstart", (e) => {
        dragSrcEl = e.target;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index);
        e.target.classList.add("dragging");
      });

      div.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
      });

      div.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });

      div.addEventListener("drop", (e) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData("text"));
        const toIndex = parseInt(e.target.dataset.index);
        [shuffledOrder[fromIndex], shuffledOrder[toIndex]] = [shuffledOrder[toIndex], shuffledOrder[fromIndex]];
        renderList(shuffledOrder);
      });

      container.appendChild(div);
    });
  }

  function checkOrder() {
    const items = container.querySelectorAll(".draggable");
    items.forEach((el, i) => {
      if (el.textContent.trim() === correctOrder[i]) {
        el.classList.add("correct");
        el.classList.remove("incorrect");
      } else {
        el.classList.add("incorrect");
        el.classList.remove("correct");
      }
    });
  }

  renderList(shuffledOrder);