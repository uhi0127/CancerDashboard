import { MakeChart } from './makeChart.mjs';
import { fetchData } from './Fetches.js';

export class HorizontalbarChart extends MakeChart {
    constructor(id) {
        super(id);
    }
    drawGraph(){
      async function fetchDataAndProcess() {
        try {
          await fetchData.getData(); // 데이터를 가져오는 비동기 함수 호출
          const cancerData = await fetchData.dataRemake(); // 데이터를 처리하는 비동기 함수 호출
         
            const totalGenderCountsByAgeGroup = {};
            const labelData = [];
            const valueData = [];
            
            

            const calculateCancerTotals = (data) => {
                const cancerTotals = {};
              
                for (const cancerType in data) {
                  let total = 0;
              
                  for (const year in data[cancerType]) {
                    for (const ageGroup in data[cancerType][year]) {
                      total += data[cancerType][year][ageGroup].남자;
                      total += data[cancerType][year][ageGroup].여자;
                    }
                  }
              
                  cancerTotals[cancerType] = total;
                }
              
                return cancerTotals;
              }
              
              const cancerTotals = calculateCancerTotals(cancerData);
             

              for(let key in cancerTotals){
                if(key !== '모든암'){
                  labelData.push(key)
                  valueData.push(cancerTotals[key])
                }
              }
              
              // 결과를 배열로 변환
              const resultArray = Object.entries(cancerTotals).map(([cancerType, total]) => ({ cancerType, total }));
             
        
            for (const cancerType in cancerData) {
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
            }
            const ageV = Object.keys(totalGenderCountsByAgeGroup);
            const allData = [];
            const mensData = [];
            const womenData = [];
            for(let i=0; i<ageV.length; i++){
                allData.push(totalGenderCountsByAgeGroup[ageV[i]]['전체']);
            }
           

            
            const horizontalBar = document.getElementById('sumaryCanvas_s').getContext('2d');
            const canvas = document.getElementById('sumaryCanvas_s');
            // Set the height based on the window width
          if (window.innerWidth < 800) {
            /*canvas.classList.remove('largeCanvas');
            canvas.classList.add('smallCanvas');*/
            canvas.height = 700;
          } else {
            /*canvas.classList.remove('smallCanvas');
            canvas.classList.add('largeCanvas');*/
          }
            console.log(canvas.height);
            const horizontalBarChart = new Chart(horizontalBar, {
              type: 'bar', // 수정: 'Bar' -> 'bar'
              data: {
                labels: labelData,
                datasets: [
                  {
                        label: '전체',
                        data: valueData,
                        backgroundColor: 'rgba(166, 94, 217, 0.2)',
                        borderColor: 'rgba(166, 94, 217, 1)',
                        borderWidth: 1,
                        barThickness:window.innerWidth>800 ? 10 : 8,
                  },
                  
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: window.innerWidth>800 ? true : false,
                aspectRatio: window.innerWidth>800 ? 2 : null,
                indexAxis: 'y', // 가로 막대 그래프를 위해 'y'로 설정
                scales: {
                  y: {
                      ticks: {
                          font: {
                              size:window.innerWidth>800 ? 12 : 10
                          },
                          
                      }
                  },
                 
                }
              }
            });
        } catch (error) {
          console.error('Error occurred:', error);
        }
      }
      fetchDataAndProcess();
    }
}



const myhChart = new  HorizontalbarChart(' HorizontalbarChart');
myhChart.drawGraph();