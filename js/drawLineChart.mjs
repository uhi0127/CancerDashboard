import { MakeChart } from './makeChart.mjs';
import { fetchData } from './Fetches.js';


export class LineChart extends MakeChart {
    constructor(id) {
        super(id);
    }
    drawGraph(){
      async function fetchDataAndProcess() {
        try {
          await fetchData.getData(); // 데이터를 가져오는 비동기 함수 호출
          const cancerData = await fetchData.dataRemake(); // 데이터를 처리하는 비동기 함수 호출
          
          
          
          let selectInfo = document.getElementById('yearCancers');
      let lineChart;

      selectInfo.addEventListener('change', () => {
        drawChart(selectInfo.value);
      });

      const drawChart = (cancerType) => {
        let femaleSumByYear = {};
        let maleSumByYear = {};
        let allSumByYear = {};
        let yearArray = [];

        for (let key in cancerData[cancerType]) {
          yearArray.push(key);
          let ageGroups = Object.keys(cancerData[cancerType][key]);
          ageGroups.forEach(ageGroup => {
            if (!maleSumByYear[key]) {
              maleSumByYear[key] = 0;
            }
            if(!femaleSumByYear[key]){
              femaleSumByYear[key] = 0;
            }
            if(!allSumByYear[key]){
              allSumByYear[key] = 0;
            }
            maleSumByYear[key] += cancerData[cancerType][key][ageGroup]['남자'];
            femaleSumByYear[key] += cancerData[cancerType][key][ageGroup]['여자'];
            allSumByYear[key] += (cancerData[cancerType][key][ageGroup]['남자'] + cancerData[cancerType][key][ageGroup]['여자']);
          });
        }

        let maleSumArray = Object.values(maleSumByYear);
        let femaleSumArray = Object.values(femaleSumByYear);
        let allSumArray = Object.values(allSumByYear);

        if (lineChart) {
          lineChart.destroy();
        }
        const titleText = selectInfo.value === '모든암' ?  `연령별 ${selectInfo.value} 그래프` : `연도별 ${selectInfo.value}암 그래프`
        var ctxLine = document.getElementById('yearCanvas').getContext('2d');
        lineChart = new Chart(ctxLine, {
          type: 'line',
          data: {
            labels: yearArray,
            datasets: [
              {
                label: '전체',
                data: allSumArray,
                borderColor: 'rgba(166, 94, 217, 1)',
                borderWidth: 1
              },
              {
                label: '남성',
                data: maleSumArray,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              },
              {
                label: '여성',
                data: femaleSumArray,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              },
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text : titleText,
                font:{
                  size:window.innerWidth>800 ? 20 : 16
                }
              }
            }
          }
        });
      }
      drawChart('모든암');
        
        } catch (error) {
          console.error('Error occurred:', error);
        }
      }
      fetchDataAndProcess();
    }
}

const mylChart = new LineChart('lineChart');
mylChart.drawGraph();

export{mylChart};
