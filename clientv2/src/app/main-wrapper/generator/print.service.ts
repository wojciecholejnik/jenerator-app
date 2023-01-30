import { Injectable } from '@angular/core';
import { NewTest, Test } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  stylesheet = `
  * {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
  }

  .container {
    min-height: calc(297mm * 0.9);
    max-height: calc(297mm * 0.9);
    padding: calc(4mm * 0.9);
  }

  .header {
    margin-bottom: calc(5mm * 0.9);
    border-bottom: 1px solid black;
    height: calc(20mm * 0.9);
  }

  header::after {
    content: "";
    clear: both;
    display: table;
  }

  .student-info {
    float: left;
  }

  .date-placeholder, .student-name-placehoder {
    font-size: calc(4mm * 0.9);
  }

  .date-placeholder {
    margin-bottom: calc(3mm * 0.9);
  }

  .test-info {
    float: right;
    text-align: end;
  }

  .category-name {
    font-size: calc(4mm * 0.9);
    margin: 0 0 calc(3mm * 0.9) 0;
  }

  .emoticon {
    width: calc(10mm * 0.9);
    margin-right: calc(2mm * 0.9);
  }

  .composer-container::after {
    content: "";
    clear: both;
    display: table;
  }

  .composer-name {
    float: right;
    font-size: calc(3mm * 0.9);
    margin-top: calc(3mm * 0.9);
  }

  .question {
    margin-bottom: calc(3mm * 0.9);
    padding-top: calc(1mm * 0.9);
    border-top: 1px solid gray;
    height: calc(85mm * 0.9);
  }

  .question.open {
    height: calc(100mm * 0.9);
  }

  .first {
    border: none;
  }

  .question::after {
    content: "";
    clear: both;
    display: table;
  }

  h6 {
    margin: calc(2mm * 0.9) 0;
    font-size: calc(4mm * 0.9);
  }

  .left-container {
    float: left;
  }

  .answer-container {
    position: relative;
    margin-top: calc(3px * 0.9);
  }

  div.checkbox {
    border: 1px solid black;
    border-radius: 2px;
    width: calc(3mm * 0.9);
    min-height: calc(3mm * 0.9);
    display: inline-block;
    margin: 0 calc(2mm * 0.9) 0 calc(2mm * 0.9);
    position: absolute;
    top: calc(2px * 0.9);
    left: 0;
  }

  div.rightAnswer {
    width: calc(3mm * 0.9);
    min-height: calc(3mm * 0.9);
    box-shadow: inset 0 0 0 8px black;
  }

  div.checkbox-label {
    min-height: calc(3mm * 0.9);
    font-size: calc(4mm * 0.9);
    width: 90%;
    margin-left: calc(8mm * 0.9);
  }

  .right-container {
    float: right;
  }

  img {
    max-height: calc(80mm * 0.9);
    max-width: calc(70mm * 0.9);
  }`

  printUnresolvedTest(test: Test | NewTest): void {

    const divContents = document.getElementById("print-selection")?.innerHTML;

    if (divContents) {
      const style = document.createElement('style');
      style.innerHTML = this.stylesheet;
      
      const html = document.createElement('div');
      html.innerHTML = `
      
      <!-- FIRST-PAGE -->
  <div class="container">
    <!-- HEADER -->
    <div class="header">
      <div class="student-info">
        <p class="date-placeholder">Data:</p>
        <p class="student-name-placehoder">Imię i Nazwisko:</p>
      </div>
      <div class="test-info">
        <h6 class="category-name">${test.category?.name}</h6>
        <div class="composer-container">
          <img class="emoticon" src=${test.author.emoticon}>
          <p class="composer-name">${test.author.shortName}</p>
        </div>
      </div>
    </div>

    <!-- QUESTIONS -->

    <!-- QUESTION1 -->
    <div class="question first">
      <div class="left-container">
        <h6>1. ${test.questions[0].questionContent} </h6>
        <div class="answersContainer">         
          <div class="answers">

            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[0].answers[0].content}</div>
            </div>
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[0].answers[1].content}</div>
            </div>
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[0].answers[2].content}</div>
            </div>
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[0].answers[3].content}</div>
            </div>

          </div>
        </div>
      </div>
      ${!test.questions[0].img ? '' : `
      <div class="right-container">
        <img src=${test.questions[0].img}>
      </div>`}
    </div>

    <!-- QUESTION2 -->
    <div class="question">
      <div class="left-container">
        <h6>2. ${test.questions[1].questionContent} </h6>
        <div class="answersContainer">         
          <div class="answers">
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[1].answers[0].content}</div>
            </div>
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[1].answers[1].content}</div>
            </div>
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[1].answers[2].content}</div>
            </div>
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[1].answers[3].content}</div>
            </div>
          </div>
        </div>
      </div>
      ${!test.questions[1].img ? '' : `
      <div class="right-container">
        <img src=${test.questions[1].img}>
      </div>`}
    </div>

    <!-- QUESTION3 -->
    <div class="question">
      <div class="left-container">
        <h6>3. ${test.questions[2].questionContent} </h6>
        <div class="answersContainer">         
          <div class="answers">
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[2].answers[0].content}</div>
            </div>
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[2].answers[1].content}</div>
            </div>
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[2].answers[2].content}</div>
            </div>
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[2].answers[3].content}</div>
            </div>
          </div>
        </div>
      </div>
      ${!test.questions[2].img ? '' : `
      <div class="right-container">
        <img src=${test.questions[2].img}>
      </div>`}
    </div>
  </div>

  <!-- SECOND-PAGE -->
  <div class="container">

    <!-- QUESTION4 -->
    <div class="question first">
      <div class="left-container">
        <h6>4. ${test.questions[3].questionContent} </h6>
        <div class="answersContainer">         
          <div class="answers">
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[3].answers[0].content}</div>
            </div>
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[3].answers[1].content}</div>
            </div>
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[3].answers[2].content}</div>
            </div>
            <div class="answer-container">
              <div class="checkbox"></div>
              <div class="checkbox-label">${test.questions[3].answers[3].content}</div>
            </div>
          </div>
        </div>
      </div>
      ${!test.questions[3].img ? '' : `
      <div class="right-container">
        <img src=${test.questions[3].img}>
      </div>`}
    </div>

    <!-- QUESTION5 -->
    <div class="question open">
      <div class="left-container">
        <h6>5. ${test.questions[4].questionContent} </h6>
        <div class="answersContainer">
        </div>
      </div>
      ${!test.questions[4].img ? '' : `
      <div class="right-container">
        <img src=${test.questions[4].img}>
      </div>`}
    </div>

    <!-- QUESTION6 -->
    <div class="question open">
      <div class="left-container">
        <h6>6. ${test.questions[5].questionContent} </h6>
        <div class="answersContainer">
        </div>
      </div>
      ${!test.questions[5].img ? '' : `
      <div class="right-container">
        <img src=${test.questions[5].img}>
      </div>`}
    </div>
    
  </div>
      
      
      `;
      
      const a = window.open("", '_blank');
      if (a && a.document && a.document.querySelector('body')) {
        const b = a.document.querySelector('body');
        if (b) {
          b.innerHTML = html.innerHTML;
          b.appendChild(style)
        }
        a.print();
        a.close();
      }
    }
  }

  printResolvedTest(test: Test | NewTest): void {

  const divContents = document.getElementById("print-selection")?.innerHTML;

  if (divContents) {
    const style = document.createElement('style');
    style.innerHTML = this.stylesheet;
    
    const html = document.createElement('div');
    html.innerHTML = `
    
    <!-- FIRST-PAGE -->
<div class="container">
  <!-- HEADER -->
  <div class="header">
    <div class="student-info">
      <p class="date-placeholder">Data:</p>
      <p class="student-name-placehoder">Imię i Nazwisko:</p>
    </div>
    <div class="test-info">
      <h6 class="category-name">${test.category?.name}</h6>
      <div class="composer-container">
        <img class="emoticon" src=${test.author.emoticon}>
        <p class="composer-name">${test.author.shortName}</p>
      </div>
    </div>
  </div>

  <!-- QUESTIONS -->

  <!-- QUESTION1 -->
  <div class="question first">
    <div class="left-container">
      <h6>1. ${test.questions[0].questionContent} </h6>
      <div class="answersContainer">         
        <div class="answers">

          <div class="answer-container">
            <div class="checkbox ${test.questions[0].answers[0].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[0].answers[0].content}</div>
          </div>
          <div class="answer-container">
          <div class="checkbox ${test.questions[0].answers[1].isRight ? 'rightAnswer' : ''}"></div>
          <div class="checkbox-label">${test.questions[0].answers[1].content}</div>
          </div>
          <div class="answer-container">
          <div class="checkbox ${test.questions[0].answers[2].isRight ? 'rightAnswer' : ''}"></div>
          <div class="checkbox-label">${test.questions[0].answers[2].content}</div>
          </div>
          <div class="answer-container">
          <div class="checkbox ${test.questions[0].answers[0].isRight ? 'rightAnswer' : ''}"></div>
          <div class="checkbox-label">${test.questions[0].answers[3].content}</div>
          </div>

        </div>
      </div>
    </div>
    ${!test.questions[0].img ? '' : `
    <div class="right-container">
      <img src=${test.questions[0].img}>
    </div>`}
  </div>

  <!-- QUESTION2 -->
  <div class="question">
    <div class="left-container">
      <h6>2. ${test.questions[1].questionContent} </h6>
      <div class="answersContainer">         
        <div class="answers">
          <div class="answer-container">
            <div class="checkbox ${test.questions[1].answers[0].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[1].answers[0].content}</div>
          </div>
          <div class="answer-container">
            <div class="checkbox ${test.questions[1].answers[1].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[1].answers[1].content}</div>
          </div>
          <div class="answer-container">
            <div class="checkbox ${test.questions[1].answers[2].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[1].answers[2].content}</div>
          </div>
          <div class="answer-container">
            <div class="checkbox ${test.questions[1].answers[3].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[1].answers[3].content}</div>
          </div>
        </div>
      </div>
    </div>
    ${!test.questions[1].img ? '' : `
    <div class="right-container">
      <img src=${test.questions[1].img}>
    </div>`}
  </div>

  <!-- QUESTION3 -->
  <div class="question">
    <div class="left-container">
      <h6>3. ${test.questions[2].questionContent} </h6>
      <div class="answersContainer">         
        <div class="answers">
          <div class="answer-container">
            <div class="checkbox ${test.questions[2].answers[0].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[2].answers[0].content}</div>
          </div>
          <div class="answer-container">
            <div class="checkbox ${test.questions[2].answers[1].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[2].answers[1].content}</div>
          </div>
          <div class="answer-container">
            <div class="checkbox ${test.questions[2].answers[2].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[2].answers[2].content}</div>
          </div>
          <div class="answer-container">
            <div class="checkbox ${test.questions[2].answers[3].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[2].answers[3].content}</div>
          </div>
        </div>
      </div>
    </div>
    ${!test.questions[2].img ? '' : `
    <div class="right-container">
      <img src=${test.questions[2].img}>
    </div>`}
  </div>
</div>

<!-- SECOND-PAGE -->
<div class="container">

  <!-- QUESTION4 -->
  <div class="question first">
    <div class="left-container">
      <h6>4. ${test.questions[3].questionContent} </h6>
      <div class="answersContainer">         
        <div class="answers">
          <div class="answer-container">
            <div class="checkbox ${test.questions[3].answers[0].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[3].answers[0].content}</div>
          </div>
          <div class="answer-container">
            <div class="checkbox ${test.questions[3].answers[1].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[3].answers[1].content}</div>
          </div>
          <div class="answer-container">
            <div class="checkbox ${test.questions[3].answers[2].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[3].answers[2].content}</div>
          </div>
          <div class="answer-container">
            <div class="checkbox ${test.questions[3].answers[3].isRight ? 'rightAnswer' : ''}"></div>
            <div class="checkbox-label">${test.questions[3].answers[3].content}</div>
          </div>
        </div>
      </div>
    </div>
    ${!test.questions[3].img ? '' : `
    <div class="right-container">
      <img src=${test.questions[3].img}>
    </div>`}
  </div>

  <!-- QUESTION5 -->
  <div class="question open">
    <div class="left-container">
      <h6>5. ${test.questions[4].questionContent} </h6>
      <div class="answersContainer">
      </div>
    </div>
    ${!test.questions[4].img ? '' : `
    <div class="right-container">
      <img src=${test.questions[4].img}>
    </div>`}
  </div>

  <!-- QUESTION6 -->
  <div class="question open">
    <div class="left-container">
      <h6>6. ${test.questions[5].questionContent} </h6>
      <div class="answersContainer">
      </div>
    </div>
    ${!test.questions[5].img ? '' : `
    <div class="right-container">
      <img src=${test.questions[5].img}>
    </div>`}
  </div>
  
</div>
    `;
    
      const a = window.open("", '_blank');
      if (a && a.document && a.document.querySelector('body')) {
        const b = a.document.querySelector('body');
        if (b) {
          b.innerHTML = html.innerHTML;
          b.appendChild(style)
        }
        a.print();
        a.close();
      }
    }
  }

}
