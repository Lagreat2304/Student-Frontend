import React, {useEffect, useState, useRef} from 'react';
import './App.css';
function App() {
  const [returnedData, setReturnedData] = useState(['']);
  const[student,setStudent] = useState({Reg:'', Name:'',DOB:'',Department:'',GPA:'',Address:'',PhoneNo:''});
  const[selectedstudent, setSelectedStudent] = useState([null]);
  const studentsPerPage = 5;
  const setInput = (e) => {
    const {name,value} = e.target;
    console.log(value);
    setStudent(prevState => ({
      ...prevState,
      [name] : value
    }));
  }
  
  const updatestudent = async () => {
    try {
      const newData = await fetch(`http://localhost:5000/studentupdate/${selectedstudent.Reg}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(selectedstudent),
      }).then((res) => res.json());

      if (Array.isArray(newData)) {
        setReturnedData(newData);
        console.log('student updated successfully');
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error('Error updating student:', error.message);
    }
  };

  const selectedStudentForUpdate = (student) => {
    setSelectedStudent({ ...student });
  };

  const deletestudent = async (Reg) => {
    try {
      const newData = await fetch(`http://localhost:5000/deleteStudent/${Reg}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(res => res.json());
  
      if (Array.isArray(newData)) {
        setReturnedData(newData);
        console.log('Student Deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting Student:', error.message);
    }
  };

  const addStudent = async() => {
    if(student.Reg === '' || student.Name === '' || student.DOB==='' || student.Department==='' || student.GPA==='' || student.Address==='' || student.PhoneNo===''){
      alert("All Fields should be filled");
      return;
    }
    const newData = await fetch('http://localhost:5000/addStudent',{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json'
      },
      body : JSON.stringify({
        ...student
      })
    })
    .then(res => res.json())
    if(Array.isArray(newData)){
      setReturnedData(newData);
  }
};
  
  const fetchData = async() => {
    const newData = await fetch('http://localhost:5000/studentsearch',{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json'
      },
      body : JSON.stringify({
        name : student.Reg
      })
    })
    .then(res => res.json())
    if(Array.isArray(newData)){
      setReturnedData(newData);
      console.log("Sucess");
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
const startIndex = (currentPage - 1) * studentsPerPage;
const endIndex = startIndex + studentsPerPage;
const displayedStudents = returnedData.slice(startIndex, endIndex);

  return (
    <div className="App">
       <div className='form-container'>
    <label className='form-label'>Register No</label>
      <input type='text' className='form-input' name = 'Reg' placeholder='Register No' onChange={setInput}></input>
      <label className='form-label'>Name</label>
      <input type='text' name = 'Name' className='form-input' placeholder='Student Name' onChange={setInput} ></input>
     <label className='form-label'>Date of Birth</label>
      <input type='text' className='form-input' name = 'DOB' placeholder='Date of Birth(dd/mm/yyyy)' onChange={setInput} ></input>
      <label className='form-label'>Department</label>
     <input  name = 'Department' className='form-input' placeholder='Department' onChange={setInput} ></input>
      <label className='form-label'>GPA</label>
     <input  name = 'GPA' className='form-input' placeholder='GPA' onChange={setInput} ></input>
      <label className='form-label'>Address</label>
     <input  name = 'Address' className='form-input' placeholder='Address' onChange={setInput} ></input>
      <label className='form-label'>Phone No</label>
      <input type='text' className='form-input' name = 'PhoneNo' placeholder='Phone No' maxLength={10} onChange={setInput} ></input>
      <button className='form-button' onClick={() => fetchData()}> Fetch </button>
      <button className='form-button' onClick={() => addStudent()}> Add </button>
      <hr/>
    </div>
    <div className='table-conatiner'>
        <table>
          <thead>
            <tr>
              <th>Register Number</th>
              <th>Student Name</th>
              <th>Date of Birth</th>
              <th>Department</th>
              <th>GPA</th>
              <th>Address</th>
              <th>PhoneNo</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {displayedStudents.map((data) => (
              <tr key= {data.Reg}>
                <td>{data.Reg}</td>
                <td>{data.Name}</td>
                <td>{data.DOB}</td>
                <td>{data.Department}</td>
                <td>{data.GPA}</td>
                <td>{data.Address}</td>
                <td>{data.PhoneNo}</td>
                <td>
                <button className='update-button' onClick={() => selectedStudentForUpdate(data)}>Update</button>
                </td>
                <td>
                <button className='delete-button' onClick={() => deletestudent(data.Reg)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
          {selectedstudent && (
        <div className='update-course-overlay update-box'>
          <h3>Update Student</h3>
          <label>Register Number</label>
          <input name="Reg" value={selectedstudent.Reg} onChange={(e) => setSelectedStudent({ ...selectedstudent, Reg: e.target.value })} />
          <label>Name</label>
          <input name="Name" value={selectedstudent.Name} onChange={(e) => setSelectedStudent({ ...selectedstudent, Name: e.target.value })} />
          <label>Date of Birth</label>
          <input  name="DOB" value={selectedstudent.DOB} onChange={(e) => setSelectedStudent({ ...selectedstudent, DOB: e.target.value })} />
          <label>Department</label>
          <input name="Department" value={selectedstudent.Department} onChange={(e) => setSelectedStudent({ ...selectedstudent, Department: e.target.value })} />
          <label>GPA</label>
          <input  name="GPA" value={selectedstudent.GPA} onChange={(e) => setSelectedStudent({ ...selectedstudent, GPA: e.target.value })} />
          <label>Address</label>
          <input  name="Address" value={selectedstudent.Address} onChange={(e) => setSelectedStudent({ ...selectedstudent, Address: e.target.value })} />
          <label>Phone No</label>
          <input  name="PhoneNo" maxLength={10} value={selectedstudent.PhoneNo} onChange={(e) => setSelectedStudent({ ...selectedstudent, PhoneNo: e.target.value })} />
          <div className='button-container'>
          <button className= 'save-button' onClick={updatestudent}>Update</button>
          <button className='cancel-button' onClick={() => setSelectedStudent(null)}>Cancel</button>
          </div>
        </div>
      )}
          </table>
          <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(returnedData.length / studentsPerPage)))
          }
          disabled={currentPage === Math.ceil(returnedData.length / studentsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
    </div>

);
}
export default App;
