import React from 'react'

export default function DataTable({titles, fields, data}) {
    
    let rows = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let hasField = false
        for (let j = 0; j < fields.length; j++) {
            if (item[fields[j]] != undefined) {
                hasField = true
            }
        }

        if (hasField) {
            rows.push(
                <tr key={i}>
                    {fields.map((field) => (
                        <td>{item[field]}</td>
                    ))}
                </tr>
            )
        }
    }
    return (
        <div className="overflow-x-auto">
            {rows.length === 0 && 
                <p>We're sorry, we don't have information for this statisitc.</p>
            } 
            { rows.length > 0 &&
                <table className="table">
                    <thead>
                    <tr>
                        {titles.map((title, index) => (<th key={index}>{title}</th>))}
                    </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            }
        </div>
            
    )
}