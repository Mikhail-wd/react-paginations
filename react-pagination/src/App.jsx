import { useEffect, useState, Suspense } from 'react'
import TableBody from './components/tableBody';
import md5 from "md5";

function App() {
  const [idArray, setIDarray] = useState(null)
  const [calculatedPages, setCalculatedPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [reFetching, setReFetching] = useState(false)
  const [selectedValue, setSelectedValue] = useState("price")
  const [inputValue, setInputValue] = useState(26600)

  const localDate = new Date(Date.now());

  const fetchHeader = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Auth": md5("Valantis_" + (localDate.getFullYear() + "" + (((localDate.getMonth() + 1) + "").length < 2 ? "0" + (localDate.getMonth() + 1) : (localDate.getMonth() + 1)) + "" + localDate.getDate())),
  }

  function pageController(value) {
    if (value === "next") {
      setCurrentPage(currentPage + 1)
    } else {
      setCurrentPage(currentPage - 1)
    }
  }

  function submitRequest(e) {
    e.preventDefault()
    if (selectedValue == "price") {
      fetchingData(dataPrice)
    } if (selectedValue == "product") {
      fetchingData(dataProduct);
    } if (selectedValue == "brand") {
      fetchingData(dataBrand)
    }
  }

  const fetchingData = async (value) => {
    await fetch("http://api.valantis.store:40000/", value)
      .then(resData => {
        if (resData.ok !== true) {
          throw Error(resData.status + " " + resData.statusText)
        } else {
          return resData.json()
        }
      }
      )
      .then(respon => {
        setReFetching(false)
        setCurrentPage(1)
        setIDarray(respon.result)
        setCalculatedPages(Math.ceil(respon.result.length / 50))
      })
      .catch(error => {
        console.error(error.message)
        setReFetching(true)
      })
  }
  const data = {
    method: "POST",
    headers: fetchHeader,
    body: JSON.stringify({
      action: "get_ids"
    }),
  }
  const dataPrice = {
    method: "POST",
    headers: fetchHeader,
    body: JSON.stringify({
      action: "filter",
      params: { "price": inputValue * 1 }
    }),
  }
  const dataProduct = {
    method: "POST",
    headers: fetchHeader,
    body: JSON.stringify({
      action: "filter",
      params: { "product": inputValue}
    }),
  }
  const dataBrand = {
    method: "POST",
    headers: fetchHeader,
    body: JSON.stringify({
      action: "filter",
      params: { "brand": inputValue}
    }),
  }

  useEffect(() => {
    fetchingData(data)
  }, [])
  return (
    <>
      <form action="submit" className="form" >
        <select name="search" defaultValue="price" onChange={(e) => setSelectedValue(e.target.value)}>
          <option value="product">Название</option>
          <option value="price">Цена</option>
          <option value="brand">Бренд</option>
        </select>
        <input type="text" onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={(e) => submitRequest(e)}>Поиск</button>
      </form>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID </th>
            <th>Название</th>
            <th>Цена</th>
            <th>Бренд</th>
          </tr>
        </thead>
        {idArray !== null ? <TableBody array={idArray} page={currentPage} fetchHeader={fetchHeader} /> : null}
      </table>
      <hr />
      <div className="controller">
        <button className={currentPage <= 1 ? "hidden" : ""} onClick={() => pageController("back")}> Назад </button>
        <button className={currentPage >= calculatedPages ? "hidden" : ""} onClick={() => pageController("next")}> Вперед </button>
      </div>
    </>
  )
}

export default App
