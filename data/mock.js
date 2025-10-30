// Mock data seed for HR Portal
export const seed = {
  user: { 
    id: "u1", 
    name: "Dr. Sarah Johnson", 
    email: "sarah@dept.edu", 
    department: "Physics", 
    role: "Department Admin" 
  },
  people: [
    { id:"p1",  name:"Prof. Elena Ruiz", title:"Department Chair", email:"elena@dept.edu", phone:"617-495-0001", dept:"Physics", employmentType:"Faculty", status:"Active", startDate:"2014-08-15", location:"Jefferson 410" },
    { id:"p2",  name:"Alex Chen", title:"Lab Manager", email:"alex@dept.edu", phone:"617-495-0002", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2018-01-10", supervisorId:"p1", tags:["lab-safety"], location:"Jefferson 120" },
    { id:"p3",  name:"Maya Singh", title:"Research Assistant", email:"maya@dept.edu", phone:"617-495-0003", dept:"Physics", employmentType:"Student", status:"Active", startDate:"2024-09-01", supervisorId:"p2", tags:["grant-funded"], location:"Jefferson 125" },
    { id:"p4",  name:"Dr. Samuel Park", title:"Senior Research Scientist", email:"samuel@dept.edu", dept:"Physics", employmentType:"Faculty", status:"On Leave", startDate:"2012-09-01", supervisorId:"p1", tags:["sabbatical"], location:"Jefferson 305" },
    { id:"p5",  name:"Jamie Rivera", title:"Department Administrator", email:"jamie@dept.edu", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2016-03-20", supervisorId:"p1", location:"Jefferson 200" },
    { id:"p6",  name:"Priya Patel", title:"Grants Coordinator", email:"priya@dept.edu", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2019-07-12", supervisorId:"p5", tags:["grant-funded"], location:"Jefferson 205" },
    { id:"p7",  name:"Chris Johnson", title:"IT Support Specialist", email:"chrisj@dept.edu", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2020-10-01", supervisorId:"p5", tags:["union"], location:"Jefferson 015" },
    { id:"p8",  name:"Dr. Lila Ahmed", title:"Assistant Professor", email:"lila@dept.edu", dept:"Physics", employmentType:"Faculty", status:"Active", startDate:"2021-07-01", supervisorId:"p1", location:"Jefferson 360" },
    { id:"p9",  name:"Taylor Brooks", title:"Postdoctoral Fellow", email:"taylor@dept.edu", dept:"Physics", employmentType:"Postdoc", status:"Active", startDate:"2023-09-01", supervisorId:"p8", location:"Jefferson 362" },
    { id:"p10", name:"Jordan Lee", title:"Research Technician", email:"jordan@dept.edu", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2022-02-15", supervisorId:"p2", location:"Jefferson 130" },
    { id:"p11", name:"Riley Kim", title:"Administrative Assistant", email:"riley@dept.edu", dept:"Physics", employmentType:"Temp", status:"Active", startDate:"2025-01-10", endDate:"2025-12-20", supervisorId:"p5", location:"Jefferson 201" },
    { id:"p12", name:"Morgan White", title:"Finance Analyst", email:"morgan@dept.edu", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2017-05-22", supervisorId:"p5", tags:["grant-funded"], location:"Jefferson 210" },
    { id:"p13", name:"Ava Thompson", title:"Graduate Student Researcher", email:"ava@dept.edu", dept:"Physics", employmentType:"Student", status:"Active", startDate:"2023-09-01", supervisorId:"p8", location:"Jefferson 365" },
    { id:"p14", name:"Noah Martinez", title:"Undergraduate Assistant", email:"noah@dept.edu", dept:"Physics", employmentType:"Student", status:"Active", startDate:"2025-02-01", supervisorId:"p2", location:"Jefferson 126" },
    { id:"p15", name:"Emma Wilson", title:"Communications Specialist", email:"emma@dept.edu", dept:"Physics", employmentType:"Staff", status:"On Leave", startDate:"2019-11-05", supervisorId:"p5", location:"Jefferson 220" },
    { id:"p16", name:"Dr. Marco De Luca", title:"Visiting Scholar", email:"marco@dept.edu", dept:"Physics", employmentType:"Temp", status:"Active", startDate:"2025-03-01", endDate:"2025-09-01", supervisorId:"p1", location:"Jefferson 375" },
    { id:"p17", name:"Olivia Garcia", title:"HR Coordinator", email:"olivia@dept.edu", dept:"Physics", employmentType:"Staff", status:"Active", startDate:"2020-06-18", supervisorId:"p5", location:"Jefferson 206" },
    { id:"p18", name:"William Brown", title:"Systems Administrator", email:"william@dept.edu", dept:"Physics", employmentType:"Staff", status:"Terminated", startDate:"2015-04-01", endDate:"2024-12-31", supervisorId:"p5" },
    { id:"p19", name:"Dr. Hannah Ito", title:"Associate Professor", email:"hannah@dept.edu", dept:"Physics", employmentType:"Faculty", status:"Active", startDate:"2016-07-01", supervisorId:"p1", location:"Jefferson 340" },
    { id:"p20", name:"Ben Carter", title:"Lab Technician", email:"ben@dept.edu", dept:"Chemistry", employmentType:"Staff", status:"Active", startDate:"2021-04-01", supervisorId:"p21", location:"Mallinckrodt 110" },
    { id:"p21", name:"Prof. Laura Nguyen", title:"Department Chair", email:"laura@chem.edu", dept:"Chemistry", employmentType:"Faculty", status:"Active", startDate:"2013-08-15", location:"Mallinckrodt 400" },
    { id:"p22", name:"Sophia Adams", title:"Lab Manager", email:"sophia@chem.edu", dept:"Chemistry", employmentType:"Staff", status:"Active", startDate:"2019-01-15", supervisorId:"p21", location:"Mallinckrodt 120" },
    { id:"p23", name:"Ethan Ross", title:"Postdoctoral Fellow", email:"ethan@chem.edu", dept:"Chemistry", employmentType:"Postdoc", status:"Active", startDate:"2024-09-01", supervisorId:"p21" },
    { id:"p24", name:"Dr. Nina Kaur", title:"Assistant Professor", email:"nina@chem.edu", dept:"Chemistry", employmentType:"Faculty", status:"Active", startDate:"2022-07-01", supervisorId:"p21", location:"Mallinckrodt 320" },
    { id:"p25", name:"Leo Turner", title:"Research Assistant", email:"leo@chem.edu", dept:"Chemistry", employmentType:"Student", status:"Active", startDate:"2024-09-01", supervisorId:"p22", location:"Mallinckrodt 125" },
    { id:"p26", name:"Amelia Diaz", title:"Administrative Coordinator", email:"amelia@chem.edu", dept:"Chemistry", employmentType:"Staff", status:"Active", startDate:"2018-10-01", supervisorId:"p21", location:"Mallinckrodt 210" },
    { id:"p27", name:"Owen Patel", title:"Instrument Specialist", email:"owen@chem.edu", dept:"Chemistry", employmentType:"Staff", status:"Active", startDate:"2020-05-12", supervisorId:"p22", location:"Mallinckrodt 140" },
    
    { id:"p28", name:"Prof. Karen Li", title:"Department Chair", email:"karen@bio.edu", dept:"Biology", employmentType:"Faculty", status:"Active", startDate:"2011-09-01", location:"BioLabs 300" },
    { id:"p29", name:"Diego Alvarez", title:"Lab Manager", email:"diego@bio.edu", dept:"Biology", employmentType:"Staff", status:"Active", startDate:"2017-02-20", supervisorId:"p28", location:"BioLabs 120" },
    { id:"p30", name:"Chloe Bennett", title:"Research Scientist", email:"chloe@bio.edu", dept:"Biology", employmentType:"Faculty", status:"Active", startDate:"2019-08-01", supervisorId:"p28", location:"BioLabs 240" },
    { id:"p31", name:"Rahul Mehta", title:"Postdoctoral Fellow", email:"rahul@bio.edu", dept:"Biology", employmentType:"Postdoc", status:"Active", startDate:"2023-07-01", supervisorId:"p30" },
    { id:"p32", name:"Mina Okafor", title:"Research Assistant", email:"mina@bio.edu", dept:"Biology", employmentType:"Student", status:"Active", startDate:"2024-09-01", supervisorId:"p29" },
    { id:"p33", name:"Grace Yoon", title:"Grants Manager", email:"grace@bio.edu", dept:"Biology", employmentType:"Staff", status:"Active", startDate:"2016-04-15", supervisorId:"p28", tags:["grant-funded"], location:"BioLabs 210" },
    { id:"p34", name:"Tom Becker", title:"Animal Facility Coordinator", email:"tom@bio.edu", dept:"Biology", employmentType:"Staff", status:"Active", startDate:"2015-11-01", supervisorId:"p29" },
    
    { id:"p35", name:"Patricia Gomez", title:"HR Director", email:"pgomez@fas.harvard.edu", dept:"Administration", employmentType:"Staff", status:"Active", startDate:"2010-01-10", location:"Smith Center 700" },
    { id:"p36", name:"Ian Wright", title:"Recruiter", email:"ian@fas.harvard.edu", dept:"Administration", employmentType:"Staff", status:"Active", startDate:"2021-06-01", supervisorId:"p35" },
    { id:"p37", name:"Sofia Rahman", title:"Compensation Analyst", email:"sofia@fas.harvard.edu", dept:"Administration", employmentType:"Staff", status:"Active", startDate:"2018-03-22", supervisorId:"p35" },
    { id:"p38", name:"Zoe Park", title:"HRIS Specialist", email:"zoe@fas.harvard.edu", dept:"Administration", employmentType:"Staff", status:"Active", startDate:"2022-09-15", supervisorId:"p35" },
    { id:"p39", name:"Louis Chen", title:"Benefits Coordinator", email:"louis@fas.harvard.edu", dept:"Administration", employmentType:"Staff", status:"Active", startDate:"2017-12-01", supervisorId:"p35" },
    { id:"p40", name:"Aiden Murphy", title:"Intern", email:"aiden@fas.harvard.edu", dept:"Administration", employmentType:"Student", status:"Active", startDate:"2025-06-01", supervisorId:"p36" }
  ],
  org: {
    root: { 
      id:"p1", 
      children:[ 
        { id:"p2", children:[ { id:"p3", children:[] }, { id:"p10", children:[] }, { id:"p14", children:[] } ] },
        { id:"p4", children:[] },
        { id:"p5", children:[ { id:"p6", children:[] }, { id:"p7", children:[] }, { id:"p11", children:[] }, { id:"p12", children:[] }, { id:"p15", children:[] }, { id:"p17", children:[] }, { id:"p18", children:[] } ] },
        { id:"p8", children:[ { id:"p9", children:[] }, { id:"p13", children:[] } ] },
        { id:"p19", children:[] }
      ] 
    }
  },
  requests: [
    { id:"r1", type:"Sabbatical", title:"Sabbatical Leave Request", dept:"Physics", requester:"Sarah Johnson", submitted:"2025-05-02", status:"Draft" },
    { id:"r2", type:"New Position", title:"Senior Research Scientist", dept:"Physics", requester:"Sarah Johnson", submitted:"2025-04-29", status:"Pending Review" },
    { id:"r3", type:"Promotion", title:"Promotion – Dr. Lila Ahmed", dept:"Physics", requester:"Sarah Johnson", submitted:"2025-04-20", status:"Approved" },
    { id:"r4", type:"New Position", title:"Grant Funding Coordinator", dept:"Physics", requester:"Sarah Johnson", submitted:"2025-04-10", status:"Rejected" },
    { id:"r5", type:"Change", title:"Title change – Lab Manager to Operations Manager", dept:"Physics", requester:"Jamie Rivera", submitted:"2025-03-22", status:"Pending Review" },
    { id:"r6", type:"Sabbatical", title:"Sabbatical – Dr. Hannah Ito", dept:"Physics", requester:"Sarah Johnson", submitted:"2025-02-15", status:"Approved" },
    { id:"r7", type:"New Position", title:"Instrument Specialist (Chemistry)", dept:"Chemistry", requester:"Laura Nguyen", submitted:"2025-05-10", status:"Pending Review" },
    { id:"r8", type:"Change", title:"Correction to FTE – Grants Manager", dept:"Biology", requester:"Karen Li", submitted:"2025-05-08", status:"Needs Revision" },
    { id:"r9", type:"Promotion", title:"Promotion – Associate to Full Professor (Physics)", dept:"Physics", requester:"Elena Ruiz", submitted:"2025-03-05", status:"Rejected" },
    { id:"r10", type:"New Position", title:"HRIS Specialist (Administration)", dept:"Administration", requester:"Patricia Gomez", submitted:"2025-04-02", status:"Approved" },
    { id:"r11", type:"Change", title:"Supervisor change – Research Technician", dept:"Physics", requester:"Alex Chen", submitted:"2025-05-12", status:"Pending Review" },
    { id:"r12", type:"Sabbatical", title:"Sabbatical – Dr. Marco De Luca", dept:"Physics", requester:"Elena Ruiz", submitted:"2025-03-28", status:"Approved" },
    { id:"r13", type:"New Position", title:"Administrative Coordinator (Chemistry)", dept:"Chemistry", requester:"Laura Nguyen", submitted:"2025-01-18", status:"Approved" },
    { id:"r14", type:"Promotion", title:"Promotion – Research Scientist (Biology)", dept:"Biology", requester:"Karen Li", submitted:"2025-02-12", status:"Pending Review" },
    { id:"r15", type:"Change", title:"Salary adjustment – Systems Administrator", dept:"Physics", requester:"Olivia Garcia", submitted:"2025-01-30", status:"Rejected" },
    { id:"r16", type:"New Position", title:"Graduate Research Assistant (Biology)", dept:"Biology", requester:"Karen Li", submitted:"2025-05-01", status:"Pending Review" },
    { id:"r17", type:"Sabbatical", title:"Sabbatical – Prof. Karen Li", dept:"Biology", requester:"Karen Li", submitted:"2025-04-12", status:"Draft" },
    { id:"r18", type:"New Position", title:"Benefits Coordinator (Admin)", dept:"Administration", requester:"Patricia Gomez", submitted:"2025-02-05", status:"Approved" },
    { id:"r19", type:"Change", title:"Extend temp appointment – Administrative Assistant", dept:"Physics", requester:"Jamie Rivera", submitted:"2025-05-15", status:"Pending Review" },
    { id:"r20", type:"Promotion", title:"Promotion – Grants Coordinator", dept:"Physics", requester:"Jamie Rivera", submitted:"2025-05-09", status:"Pending Review" }
  ],
  approvals: [
    { id:"a1", requestId:"r2", approver:"Elena Ruiz", status:"Pending", due:"2025-05-10" },
    { id:"a2", requestId:"r7", approver:"Laura Nguyen", status:"Pending", due:"2025-05-18" },
    { id:"a3", requestId:"r8", approver:"Karen Li", status:"Pending", due:"2025-05-14" },
    { id:"a4", requestId:"r10", approver:"Patricia Gomez", status:"Approved", due:"2025-04-05" },
    { id:"a5", requestId:"r13", approver:"Laura Nguyen", status:"Approved", due:"2025-01-20" },
    { id:"a6", requestId:"r14", approver:"Karen Li", status:"Pending", due:"2025-02-20" },
    { id:"a7", requestId:"r16", approver:"Karen Li", status:"Pending", due:"2025-05-07" },
    { id:"a8", requestId:"r19", approver:"Elena Ruiz", status:"Pending", due:"2025-05-22" }
  ],
  settings: { 
    notifications:true, 
    frequency:"immediate", 
    delegates:[{name:"Sam Patel", email:"sam@dept.edu"}] 
  }
};


