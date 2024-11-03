import { fetchData } from './Fetches.js';

class CancerDashboard {
   constructor(id){
      this.id = id;
      this.cancerData = {};
      this.loadingView();
      this.init();
   }

   async init() {
      await this.fetchDataAndProcess();
      
   }

   async fetchDataAndProcess() {
      try {
         await fetchData.getData();
         this.cancerData = await fetchData.dataRemake();
         // console.log(this.cancerData);
         
         this.addCancerTypes();
      } catch (error) {
         console.error("에러 발생!", error);
      }
   }

   // select에 옵션 추가하는 메소드
   addCancerTypes() {
      const cancerTypes = new Set(fetchData.allData.map(entry => entry.암종));
      const selectElements = document.querySelectorAll('.cancerTypeSelect');

      // 암 종류를 각 select 요소에 옵션으로 추가
      selectElements.forEach(selectElement => {
         cancerTypes.forEach(cancerType => {
            const option = document.createElement('option');
            option.value = cancerType;
            option.textContent = cancerType;
            selectElement.appendChild(option);
         });
      });
   }

   loadingView(){
      document.addEventListener('DOMContentLoaded', () => {
         setTimeout(() => {
             document.getElementById('loading').style.display = 'none';
             
         }, 6500); 
     });
   }
}
const cancerDashboard = new CancerDashboard("cancerDashboard");
