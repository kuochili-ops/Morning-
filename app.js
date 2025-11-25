const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let img = new Image();
img.crossOrigin = "anonymous";

let topSize = 0.08;
let bottomSize = 0.04;
let style = { fill: "black", stroke: "white" };

let topOffset = 0.15;
let bottomOffset = 0.70;

const boringQuotes = [
  "今天的我，已經不再是昨天的我。",
  "躺平還在呼吸也是一種生活方式。",
  "事情不多，但時間用在發呆。",
  "望著天花板，思考人生的意義。",
  "咖啡喝完了，無聊還沒打算走。",
  "滑手機滑到手指破皮。",
  "今天的新聞都是過去的事。",
  "大聲問候無人島的各位。",
  "想跟自己對話卻想起還在冷戰。",
  "上次收到生日禮物已經過一年。",
  "手機關靜音後發現整天沒人找我。",
  "無聊是一種平凡的浪漫。",
  "今天的亮點：沒有亮點。",
  "無聊到開始數自己打了幾次哈欠。"
];

function getRandomQuote() {
  const index = Math.floor(Math.random() * boringQuotes.length);
  return boringQuotes[index];
}

window.onload = function() {
  img.src = "IMG_5776.jpeg"; 
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    generate(); 
  };
};

document.getElementById("upload").addEventListener("change", function(e) {
  const reader = new FileReader();
  reader.onload = function(event) {
    img.src = event.target.result;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      generate();
    };
  };
  reader.readAsDataURL(e.target.files[0]);
});

function adjustSize(target, delta) {
  if (target === 'top') {
    topSize = Math.max(0.01, topSize + delta);
    document.getElementById("topSizeDisplay").innerText = topSize.toFixed(2);
  } else {
    bottomSize = Math.max(0.01, bottomSize + delta);
    document.getElementById("bottomSizeDisplay").innerText = bottomSize.toFixed(2);
  }
  generate();
}

function adjustOffset(target, delta) {
  if (target === 'top') {
    topOffset = Math.min(0.5, Math.max(0.05, topOffset + delta));
    document.getElementById("topOffsetDisplay").innerText = topOffset.toFixed(2);
  } else {
    bottomOffset = Math.min(0.9, Math.max(0.50, bottomOffset + delta));
    document.getElementById("bottomOffsetDisplay").innerText = bottomOffset.toFixed(2);
  }
  generate();
}

function changeColor() {
  const colors = ["red", "blue", "green", "purple", "orange", "brown", "black"];
  const fill = colors[Math.floor(Math.random() * colors.length)];
  style = { fill: fill, stroke: "white" };
  generate();
}

function drawTextWithStroke(text, x, y, fontSizeRatio, style) {
  const fontSize = Math.round(canvas.height * fontSizeRatio);
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.lineWidth = Math.max(2, fontSize / 15);
  ctx.strokeStyle = style.stroke;
  ctx.fillStyle = style.fill;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function getDateInfo() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`;
  const weekStr = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"][today.getDay()];
  return `${dateStr} ${weekStr}`;
}

async function getWeather(city) {
  try {
    const response = await fetch("https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-A6F3874E-27F3-4AA3-AF5A-96B365798F79&format=JSON");
    const data = await response.json();
    const location = data.records.location.find(loc => loc.locationName === city);
    if (location) {
      const wx = location.weatherElement.find(el => el.elementName === "Wx").time[0].parameter.parameterName;
      const minT = location.weatherElement.find(el => el.elementName === "MinT").time[0].parameter.parameterName;
      const maxT = location.weatherElement.find(el => el.elementName === "MaxT").time[0].parameter.parameterName;
      return `${city}：${wx}，氣溫 ${minT}~${maxT}℃`;
    }
    return "天氣資料取得失敗";
  } catch {
    return "天氣資料取得失敗";
  }
}

async function generate() {
  if (!img.src) return;
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const city = document.getElementById("city").value;
  const dateInfo
