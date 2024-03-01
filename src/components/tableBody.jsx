import { useState, useEffect } from "react"

function tableBody(props = { array, page, fetchHeader }) {
    const [idDataArray, setIdDataArray] = useState([])

    function fetchingData(value) {
        fetch("https://api.valantis.store:41000/",
            {
                method: "POST",
                headers: props.fetchHeader,
                body: JSON.stringify({
                    action: "get_items",
                    params: { "ids": value }
                }),
            })
            .then(resData =>
                resData.json()
            )
            .then(respon =>
                setIdDataArray(respon.result)
            ).catch(
                console.log(" in table...")
            )
    }
    useEffect(() => {
        fetchingData(props.array)
    }, [])
    return (
        <>
            {idDataArray.length != 0 ?
                <tbody>{
                    props.array.slice(props.page * 50 - 50, 50 * props.page).map(index =>
                        <tr key={Math.random()}>
                            <td>
                                {props.array.findIndex(value => value === index) + 1}
                            </td>
                            <td>{index}</td>
                            <td>{idDataArray.find(element => element.id == index).product}</td>
                            <td>{idDataArray.find(element => element.id == index).price}</td>
                            <td>{idDataArray.find(element => element.id == index).brand}</td>
                        </tr>
                    )}
                </tbody>
                : idDataArray.length == 0 ? <tbody><tr><td colSpan={5} style={{ textAlign: "center" }}>Загрузка...</td></tr></tbody>
                    : <tbody><tr><td colSpan={5} style={{ textAlign: "center" }}>Ошибка запроса.</td></tr></tbody>
            }
        </>
    )
}

export default tableBody;