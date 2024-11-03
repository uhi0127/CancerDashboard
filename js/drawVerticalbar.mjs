import { MakeChart } from './makeChart.mjs';
import { fetchData } from './Fetches.js';

export class VerticalbarChart extends MakeChart {
  constructor(id) {
    super(id);
  }

  drawGraph() {
    async function fetchDataAndProcess() {
      try {
        await fetchData.getData(); // 데이터를 가져오는 비동기 함수 호출
        const cancerData = await fetchData.dataRemake(); // 데이터를 처리하는 비동기 함수 호출
        
        let selectInfo = document.getElementById('ageCancers');
        let horizontalBarChart;

        selectInfo.addEventListener('change', () => {
          drawChart(selectInfo.value);
        });

        const drawChart = (cancerType) => {
          const totalGenderCountsByAgeGroup = {}; // 이곳에서 초기화

          const dataForCancerType = cancerData[cancerType];
          for (const year in dataForCancerType) {
            for (const ageGroup in dataForCancerType[year]) {
              if (!totalGenderCountsByAgeGroup[ageGroup]) {
                totalGenderCountsByAgeGroup[ageGroup] = { 전체: 0, 남자: 0, 여자: 0 };
              }

              const data = dataForCancerType[year][ageGroup];
              totalGenderCountsByAgeGroup[ageGroup].전체 += (data.남자 + data.여자);
              totalGenderCountsByAgeGroup[ageGroup].남자 += data.남자;
              totalGenderCountsByAgeGroup[ageGroup].여자 += data.여자;
            }
          }

          const ageV = Object.keys(totalGenderCountsByAgeGroup);
          const allData = [];
          const mensData = [];
          const womenData = [];
          for (let i = 0; i < ageV.length; i++) {
            allData.push(totalGenderCountsByAgeGroup[ageV[i]].전체);
            mensData.push(totalGenderCountsByAgeGroup[ageV[i]].남자);
            womenData.push(totalGenderCountsByAgeGroup[ageV[i]].여자);
          }

          if (horizontalBarChart) {
            horizontalBarChart.destroy();
          }
          
          const titleText = selectInfo.value === '모든암' ? `연령별 ${selectInfo.value} 그래프` : `연령별 ${selectInfo.value}암 그래프`;
          const ctxVerticalbar = document.getElementById('ageCanvas').getContext('2d');
          const canvas = document.getElementById('ageCanvas');

          // Set the height based on the window width
          
          /*if (window.innerWidth < 800) {
            canvas.classList.remove('largeCanvas');
            canvas.classList.add('smallCanvas');
          } else {
            canvas.classList.remove('smallCanvas');
            canvas.classList.add('largeCanvas');
          }*/

          console.log(canvas.height);

          horizontalBarChart = new Chart(ctxVerticalbar, {
            type: 'bar',
            data: {
              labels: ['0대', '10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대'],
              datasets: [
                {
                  label: '전체',
                  data: allData,
                  backgroundColor: 'rgba(166, 94, 217, 0.2)',
                  borderColor: 'rgba(166, 94, 217, 1)',
                  borderWidth: 1
                },
                {
                  label: '남성',
                  data: mensData,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
                },
                {
                  label: '여성',
                  data: womenData,
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top'
                },
                title: {
                  display: true,
                  text: titleText,
                  font:{
                    size:window.innerWidth>800 ? 20 : 16
                  }
                }
              }
            }
          });
        };

        drawChart('모든암'); // 페이지 로드 시 초기 그래프 설정
      } catch (error) {
        console.error('Error occurred:', error);
      }
    }

    fetchDataAndProcess();
  }
}

const myvChart = new VerticalbarChart('VerticalbarChart');
myvChart.drawGraph();
