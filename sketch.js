let table; // 用於存放 CSV 資料
let currentQuestionIndex = 0; // 當前題目索引
let question = ""; // 題目
let options = []; // 選項
let correctAnswer = ""; // 正確答案
let radio; // 選項 (選擇題)
let inputBox; // 文字框 (填空題)
let submitButton; // 按鈕
let result = ""; // 結果訊息
let correctCount = 0; // 答對題數
let incorrectCount = 0; // 答錯題數
let isFillInTheBlank = false; // 是否為填空題

function preload() {
  // 載入 CSV 檔案
  table = loadTable("questions.csv", "csv", "header");
}

function setup() {
  // 產生畫布
  createCanvas(windowWidth, windowHeight);
  background("#b7b7a4");

  // 建立選項 (radio 按鈕)
  radio = createRadio();
  radio.style("width", "200px");
  radio.style("font-size", "35px");
  radio.style("color", "#ddbea9");
  radio.position(windowWidth / 2 - 100, windowHeight / 2);

  // 建立文字框 (填空題)
  inputBox = createInput();
  inputBox.style("font-size", "20px");
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2);
  inputBox.hide(); // 預設隱藏

  // 建立按鈕
  submitButton = createButton("下一題");
  submitButton.style("color", "#6b705c");
  submitButton.style("font-size", "20px");
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 100);
  submitButton.mousePressed(nextQuestion);

  // 顯示第一題
  loadQuestion();
}

function draw() {
  background("#b7b7a4");

  // 繪製方框
  fill("#ffe8d6");
  noStroke();
  let rectWidth = windowWidth / 2;
  let rectHeight = windowHeight / 2;
  let rectX = (windowWidth - rectWidth) / 2;
  let rectY = (windowHeight - rectHeight) / 2;
  rect(rectX, rectY, rectWidth, rectHeight);

  // 顯示題目
  textSize(35);
  fill("#cb997e");
  textAlign(CENTER, CENTER);
  text(question, windowWidth / 2, windowHeight / 2 - 100);

  // 顯示結果訊息
  textSize(25);
  fill("#6b705c");
  text(result, windowWidth / 2, windowHeight / 2 + 150);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  radio.position(windowWidth / 2 - 100, windowHeight / 2);
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2);
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 100);
}

function loadQuestion() {
  if (currentQuestionIndex < table.getRowCount()) {
    // 確認當前行是否存在
    if (table.getRow(currentQuestionIndex)) {
      question = table.getString(currentQuestionIndex, "question");
      correctAnswer = table.getString(currentQuestionIndex, "answer");

      // 判斷是否為填空題
      isFillInTheBlank = table.getString(currentQuestionIndex, "type") === "fill";

      if (isFillInTheBlank) {
        inputBox.show();
        radio.hide();
      } else {
        inputBox.hide();
        radio.show();

        options = [
          table.getString(currentQuestionIndex, "option1"),
          table.getString(currentQuestionIndex, "option2"),
          table.getString(currentQuestionIndex, "option3"),
          table.getString(currentQuestionIndex, "option4"),
        ];

        radio.html(""); // 清空 radio
        for (let i = 0; i < options.length; i++) {
          radio.option(options[i], options[i]);
        }
      }

      result = "";
    } else {
      console.error("無法取得當前行的資料");
    }
  } else {
    question = `測驗結束！`;
    result = `答對題數：${correctCount}，答錯題數：${incorrectCount}`;
    radio.hide();
    inputBox.hide();
    submitButton.html("再試一次");
    submitButton.mousePressed(restartQuiz);
  }
}

function nextQuestion() {
  if (currentQuestionIndex < table.getRowCount()) {
    // 檢查答案
    let selected;
    if (isFillInTheBlank) {
      selected = inputBox.value(); // 取得文字框的值
      inputBox.value(""); // 清空文字框
    } else {
      selected = radio.value(); // 取得選中的選項
    }

    if (selected === correctAnswer) {
      correctCount++;
      result = "答對了";
    } else {
      incorrectCount++;
      result = "答錯了";
    }

    // 前往下一題
    currentQuestionIndex++;
    setTimeout(loadQuestion, 1000); // 延遲 1 秒顯示下一題
  }
}

function restartQuiz() {
  // 重置測驗
  currentQuestionIndex = 0;
  correctCount = 0;
  incorrectCount = 0;
  radio.show(); // 顯示選項
  inputBox.hide(); // 隱藏文字框
  submitButton.html("下一題");
  submitButton.mousePressed(nextQuestion);
  loadQuestion();
}
