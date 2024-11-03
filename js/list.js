document.addEventListener('DOMContentLoaded', function() {
    const sumLi = document.querySelector('.sumLi');
    const yearLi = document.querySelector('.yearLi');
    const ageLi = document.querySelector('.ageLi');

    const sumaryMain = document.querySelector('.sumaryMain');
    const yearMain = document.querySelector('.yearMain');
    const ageMain = document.querySelector('.ageMain');

    function showSection(section, listItem) {
        // 모든 섹션 숨기기
        sumaryMain.style.display = 'none';
        yearMain.style.display = 'none';
        ageMain.style.display = 'none';
        // 선택된 섹션 보이기
        section.style.display = 'block';

        // 모든 리스트 아이템에서 active 클래스 제거
        sumLi.classList.remove('active');
        yearLi.classList.remove('active');
        ageLi.classList.remove('active');

        // 클릭된 리스트 아이템에 active 클래스 추가
        listItem.classList.add('active');
    }

    // 초기 상태: sumaryMain만 보이기
    showSection(yearMain, yearLi);

    sumLi.addEventListener('click', function() {
        showSection(sumaryMain, sumLi);
    });

    yearLi.addEventListener('click', function() {
        showSection(yearMain, yearLi);
    });

    ageLi.addEventListener('click', function() {
        showSection(ageMain, ageLi);
    });
});