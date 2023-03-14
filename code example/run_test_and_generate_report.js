const axios = require('axios');

//variables definition
const scenarioId = 'aKpHtoYBUDjbSvwJg3Vu';
const benchReportId = 'WKuEtoYBUDjbSvwJho_T';
const generateReportUrl = '';
// const taskId = '41f2ace6-14c6-45a0-84a9-094f7f737bf8';
// const getReportUrl = ``
// let taskId= ""


const ScenarioRunQueryParams = {
  subscriptionId: 'sub_1Ljf9CGsCuoJjXhVlnsuFmS4',
  templateId: 'vWD61YMBcphGFk8fJJ0H',
  name: 'node_test'
};
const headers = {
  'accept': '*/*',
  'Authorization': 'Bearer 83b44867-67a7-48ad-9cae-ebd56da66acc' 
};


// function to generate the report
const generateReport = (reportId) => {
  console.log("generating report with report id:"+reportId );
//   axios.post("https://api.octoperf.com/tasks",{
//     "benchReportId": "rcFdvIYBUDjbSvwJ1EC_",
//     "config": {
//         "orientation": "landscape",
//         "coverPage": "# $COMPANY_NAME$\n<br>\n<br>\n<br>\n<br>\n<br>\n<br>\n<h2 style='text-align: right;'>$REPORT_NAME$</h2>\n<h3 style='text-align: right;'>$REPORT_DATE$<br></h3>\n<br>\n<br>\n<br>\n<br>\n<br>\n$REPORT_DESCRIPTION$",
//         "tablesRowCount": {
//             "StatisticTableReportItem": 20,
//             "StatisticTreeReportItem": 20,
//             "ErrorsReportItem": 20,
//             "ThresholdAlarmReportItem": 20,
//             "TextualMonitorReportItem": 5,
//             "SynopsisReportItem": 6
//         },
//         "pageFormat": "A4",
//         "pageMargin": {
//             "top": "",
//             "right": "",
//             "bottom": "",
//             "left": ""
//         },
//         "scale": 0.8,
//         "@type": "ExportReportConfig"
//     },
//     "@type": "PrintReportTask"
// }, {
//     headers
//   })
//   .then(response => {
//     console.log("report generation request has been sent","The task id is:"+response.data);
//     // getReportName(response.data);
//     // getReportName2(response.data)
    
//   })
//   .catch(error => {
//     console.log(error);
//   });

};
//get the report name
const getReportName = (taskId) => {
  let reportName = "";
  do {
    axios.get("https://api.octoperf.com/tasks/"+taskId+"/result", { headers })
    .then(response => {
      console.log(response.data);
        if (response.data === '' || taskId==='') {
          console.log("generating report.... taskId:"+taskId);
          setTimeout(()=>{console.log("waiting for the report...")}, 1000); // retry after 1 sec
        } else {
          console.log("report is ready...");
          reportName=response.data
          
        }
    }).catch(error => {
      console.log(error);
    });
  } while(reportName === "");
  
};


async function getReportName2(taskId) {
  let result = '';
  while (result === '') {
    console.log("getting thre report file name");
    const response = await axios.get(`https://api.octoperf.com/tasks/${taskId}/result`, { headers });
    result = response.data;
    console.log("response data is finally not empty:",response.data);
    // Adjust the interval below (in milliseconds) to change how frequently the URL is called:
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before making the next call
  }
  return result;
}




/*___________________________Main Program_______________*/
// Step 1: Launch the test
axios.post("https://api.octoperf.com/runtime/scenarios/run/"+scenarioId, {}, {
  headers,
  params: ScenarioRunQueryParams
})
.then(response => {
  
  console.log("test launched correctly");
  let benchResultId = response.data.benchResultIds[0];
  let reportId = response.data.id;
  // Step2: Check if the test progress
 
  const getResults = () => {
    axios.get("https://api.octoperf.com/runtime/bench-results/progress/"+"WKuEtoYBUDjbSvwJho_T", {
      headers
    })
    .then(response => {
      
      console.log("checking if the test is finished or not....","test progress: "+response.data.value+"%");
      const value = response.data.value;
      if (value < 100) {
        setTimeout(getResults, 1000); // retry after 1 sec ( you can configure the 1 second timeout)
      } else {
        console.log("Test has finished");
        //Step 3: Launch the report generation request
        // generateReport(reportId);
        console.log("sending request to generate report...")
        axios.post('https://api.octoperf.com/tasks', 
          {
            "benchReportId": "rcFdvIYBUDjbSvwJ1EC_",
            "config": {
                "orientation": "landscape",
                "coverPage": "# $COMPANY_NAME$\n<br>\n<br>\n<br>\n<br>\n<br>\n<br>\n<h2 style='\''text-align: right;'\''>$REPORT_NAME$</h2>\n<h3 style='\''text-align: right;'\''>$REPORT_DATE$<br></h3>\n<br>\n<br>\n<br>\n<br>\n<br>\n$REPORT_DESCRIPTION$",
                "tablesRowCount": {
                    "StatisticTableReportItem": 20,
                    "StatisticTreeReportItem": 20,
                    "ErrorsReportItem": 20,
                    "ThresholdAlarmReportItem": 20,
                    "TextualMonitorReportItem": 5,
                    "SynopsisReportItem": 6
                },
                "pageFormat": "A4",
                "pageMargin": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": ""
                },
                "scale": 0.8,
                "@type": "ExportReportConfig"
            },
            "@type": "PrintReportTask"
          }
          , {
            'accept': 'text/plain',
            'Authorization': 'Bearer 83b44867-67a7-48ad-9cae-ebd56da66acc',
            'Content-Type': 'application/json'
          })
          .then(response => {
            console.log("response data",response.data);
          })
          .catch(error => {
            console.error(error);
          });
        //Step 4: wait for the report to be generated and download it
        getReportName();
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
  getResults();
})
.catch(error => {
  console.log(error);
});
