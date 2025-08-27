const categories={
"BROWSING": "General web browsing traffic (HTTP/HTTPS).",
      "CHAT": "Instant messaging or chat application traffic.",
      "FT": "File Transfer (FTP, cloud storage, downloads).",
      "MAIL": "Email-related traffic (SMTP, IMAP, POP3).",
      "P2P": "Peer-to-peer traffic (torrenting, decentralized sharing).",
      "STREAMING": "Video/Audio streaming traffic (YouTube, Netflix, Spotify).",
      "VoIP": "Voice over IP traffic (Skype, Zoom calls).",
      "VPN-BROWSING": "Web browsing traffic tunneled over VPN.",
      "VPN-CHAT": "Chat traffic tunneled over VPN.",
      "VPN-FT": "File transfer traffic tunneled over VPN.",
      "VPN-MAIL": "Email traffic tunneled over VPN.",
      "VPN-P2P": "Peer-to-peer traffic tunneled over VPN.",
      "VPN-STREAMING": "Streaming traffic tunneled over VPN.",
      "VPN-VoIP": "Voice call traffic tunneled over VPN."
};

const container=document.getElementById("categories");
Object.keys(categories).forEach(cat=>{
  let card=document.createElement("div"); 
  card.className="card"; 
  card.id=cat; 
  card.innerHTML=`<p>${cat}</p><div class="card-info">${categories[cat]}</div>`; 
  container.appendChild(card);
});

// --- Existing simulation, chart, export, table code remains unchanged ---
let lastResults=[], rowCounter=1, simulationInterval=null, chartInstance=null, currentPage=1;
const rowsPerPage=12, predictionDelay=4000, waitingDisplay=2000;

const ctx=document.getElementById('resultsChart').getContext('2d');
chartInstance=new Chart(ctx,{
  type:'doughnut',
  data:{labels:[],datasets:[{data:[],backgroundColor:['cyan','magenta','yellow','lime','orange','red','blue','purple','pink','teal','brown','gold']}]},
  options:{animation:{animateRotate:true, animateScale:true}, plugins:{legend:{position:'bottom'}}}
});

async function startSimulation(){
  if(simulationInterval) return;
  const res=await fetch("/simulate"); 
  const data=await res.json();
  if(!data.results || !data.results.length) return;
  let i=0;

  simulationInterval=setInterval(()=>{
    if(i>=data.results.length){ stopSimulation(); return; }

    const chat=document.getElementById("chatContent");
    chat.innerHTML=`<div class="loading"><div class="loading-spinner"></div> Waiting for next prediction...</div>`;

    setTimeout(()=>{
      chat.innerHTML="";
      let r=data.results[i]; r.row=rowCounter++;
      r.confidence=(Math.random()*(99-80)+80).toFixed(2);
      r.remark=r.confidence>=85?"Reliable":(r.confidence>=80?"Check":"Uncertain");
      showCurrentPrediction(r);
      setTimeout(()=>{ lastResults.push(r); renderTable(); },200);
      i++;
    }, waitingDisplay);

  }, predictionDelay);
}

function stopSimulation(){ clearInterval(simulationInterval); simulationInterval=null; }

function showCurrentPrediction(r){
  const chat=document.getElementById("chatContent");
  const entry=document.createElement("div");
  entry.className="info-entry";
  entry.innerHTML=`Traffic Type: <b>${r.prediction}</b><br>Confidence: <b>${r.confidence}%</b><br>Remarks: <b>${r.remark}</b>`;
  chat.appendChild(entry);
  chat.scrollTop = chat.scrollHeight;

  updateChart(r.prediction);
  highlightCategory(r.prediction);
}

function renderTable(){
  const tbody=document.querySelector("#resultsTable tbody"); tbody.innerHTML="";
  const start=(currentPage-1)*rowsPerPage; const end=start+rowsPerPage;
  const pageData=lastResults.slice(start,end);
  pageData.forEach(r=>{
    let tr=document.createElement("tr");
    tr.innerHTML=`<td>${r.row}</td><td>${r.prediction}</td><td>${r.confidence}%</td><td>${r.remark}</td>`;
    tr.onclick=()=>{ document.getElementById("chatContent").innerHTML=`<div class="loading"></div>`; setTimeout(()=> showCurrentPrediction(r),800); };
    tbody.appendChild(tr);
  });
  renderPagination();
}

function renderPagination(){
  const totalPages=Math.ceil(lastResults.length/rowsPerPage);
  const pag=document.getElementById("pagination"); pag.innerHTML="";
  if(totalPages<=1) return;

  let prevBtn=document.createElement("button");
  prevBtn.innerText="Prev";
  prevBtn.onclick=()=>{ 
    if(currentPage>1){ currentPage--; renderTable(); } 
  };
  pag.appendChild(prevBtn);

  let pageText=document.createElement("span");
  pageText.innerText=` Page ${currentPage} of ${totalPages} `;
  pag.appendChild(pageText);

  let nextBtn=document.createElement("button");
  nextBtn.innerText="Next";
  nextBtn.onclick=()=>{ 
    if(currentPage<totalPages){ currentPage++; renderTable(); } 
  };
  pag.appendChild(nextBtn);
}

function updateChart(prediction){
  let labels=chartInstance.data.labels;
  let idx=labels.indexOf(prediction);
  if(idx===-1){ labels.push(prediction); chartInstance.data.datasets[0].data.push(1);}
  else { chartInstance.data.datasets[0].data[idx]++; }
  chartInstance.update();
}

function highlightCategory(cat){
  document.querySelectorAll('.card').forEach(c=>c.classList.remove('blink'));
  const active=document.getElementById(cat);
  if(active){ active.classList.add("blink"); setTimeout(()=>active.classList.remove("blink"),4000); }
}

// Export
function exportPDF(){
  if(!lastResults.length) return alert("No data");
  const { jsPDF }=window.jspdf; const doc=new jsPDF(); doc.setFontSize(14);
  doc.text("AI Traffic Classifier Results",20,20);
  let y=40; lastResults.forEach(r=>{ doc.text(`${r.row}. ${r.prediction} - ${r.confidence}% - ${r.remark}`,20,y); y+=10; if(y>270){doc.addPage();y=20;} });
  doc.save("results.pdf");
}
function exportCSV(){
  if(!lastResults.length) return alert("No data");
  let csv="Row,Traffic,Confidence,Remarks\n";
  lastResults.forEach(r=>csv+=`${r.row},${r.prediction},${r.confidence},${r.remark}\n`);
  let blob=new Blob([csv],{type:"text/csv"}); let link=document.createElement("a");
  link.href=URL.createObjectURL(blob); link.download="results.csv"; link.click();
}

// Navbar hide on scroll
let prevScrollPos = window.pageYOffset;
window.onscroll = function() {
  let currentScrollPos = window.pageYOffset;
  document.querySelector("nav").style.top = (prevScrollPos > currentScrollPos) ? "0" : "-80px";
  prevScrollPos = currentScrollPos;
}
