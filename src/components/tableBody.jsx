import { useState, useEffect } from "react"

function tableBody({ array, page, fetchHeader }) {
    const [data, setData] = useState([])
    const [idDataArray, setIdDataArray] = useState(null)
    useEffect(() => {
        async function fetchingData() {
            await fetch("https://api.valantis.store:40000/",
                {
                    method: "POST",
                    headers: fetchHeader,
                    body: JSON.stringify({
                        action: "get_items",
                        params: { "ids": array }
                    }),
                })
                .then(resData =>
                    resData.json()
                )
                .then(respon => {
                    setIdDataArray(respon.result)
                }
                ).catch(
                    console.error("Some error")
                )
        }
        fetchingData()
        setData(array)
        return () => setIdDataArray(null)
    }, [array])
    return (
        <>
            {idDataArray !== null ?
                <tbody>{
                    data.slice(page * 50 - 50, 50 * page).map(index =>
                        <tr key={Math.random()}>
                            <td>
                                {data.findIndex(value => value === index) + 1}
                            </td>
                            <td>{index}</td>
                            <td>{idDataArray.find(element => element.id === index).product}</td>
                            <td>{idDataArray.find(element => element.id === index).price}</td>
                            <td>{idDataArray.find(element => element.id === index).brand}</td>
                        </tr>
                    )}
                </tbody>
                : data.length == 0 ? <tbody><tr><td colSpan={5} style={{ textAlign: "center" }}>Ошибка запроса.</td></tr></tbody>
                : <tbody><tr><td colSpan={5} style={{ textAlign: "center" }}>Загрузка...</td></tr></tbody>
        }
        </>
    )
}

export default tableBody;