/* eslint-disable indent */
export default (content, clientName) => {
    let supportHtml = `
    <div>
        <hr style="border: 0.5px solid #ccc; margin-bottom: 10px;">
        <h2 style="font-size: 20px;">Legislation Supported By ${clientName}</h2>    
    `
    let opposeHtml = `
    <div>
        <hr style="border: 0.5px solid #ccc; margin-bottom: 10px;">
        <h2 style="font-size: 20px;">Legislation Opposed By ${clientName}</h2>    
    `
    // let neutralHtml = `
    // <div>
    //  <hr style="border: 0.5px solid #ccc; margin-bottom: 10px;">
    //  <h2 style="font-size: 20px;">Legislation Amended To ${clientName} Concern</h2>
    // `
    const passedStatus = [
        'Chaptered',
        'Signed by Governor',
        'Passed',
        // 'Enrolled',
    ]
    const failedStatus = [
        'Died',
        'Failed',
        'Vetoed',
        'Failed Passage in Committee',
    ]
    // const neturalStatus = [
    // 'In Committee Process',
    // 'Pending Referral',
    // 'In Floor Process',
    // 'In Desk Process',
    // ]
    let supportHtmlExist = false
    let opposeHtmlExist = false
    // let neutralHtmlExist = false

    for (const item of content) {
        if ([...failedStatus, ...passedStatus].includes(item?.current_status)) {
            let color = 'grey'
            let imgSrc = `${process.env.APP_URL}check.png`

            if (
                (passedStatus.includes(item?.current_status) &&
                    item?.stance == 'support') ||
                (failedStatus.includes(item?.current_status) &&
                    item?.stance == 'oppose')
            ) {
                color = 'green'
            }
            if (
                (passedStatus.includes(item?.current_status) &&
                    item?.stance == 'oppose') ||
                (failedStatus.includes(item?.current_status) &&
                    item?.stance == 'support')
            ) {
                color = 'red'
                imgSrc = `${process.env.APP_URL}cross.png`
            }

            const html = `
           <div>
                <h3 style="font-size: 20px;">
                <img src=${imgSrc} style="width: 20px; height: 20px; position: relative; top: 3px;"/>
                <span style="margin-left: 2px">${item?.measure_type ?? ''} ${
                    item?.measure_num ?? ''
                } ${item?.subject ?? ''}</span></h3>
                <p style="font-size: 16px;">${
                    item?.scorecard_content ?? 'N/A'
                }</p>
                <div>Status: <span style="color: ${color};">${
                    item?.current_status ?? ''
                }</span></div>
            </div>
            
        `

            // if (neturalStatus.includes(item?.current_status)) {
            // neutralHtmlExist = true
            // neutralHtml = neutralHtml + html
            // } else {
            if (item?.stance == 'support') {
                supportHtmlExist = true
                supportHtml = supportHtml + html
            }
            if (item?.stance == 'oppose') {
                opposeHtmlExist = true
                opposeHtml = opposeHtml + html
            }
            // }
        }
    }
    supportHtml +=
        '</div><span style="border: 1px solid #ddd; display: block; width: 100%; heighht: 1px;"></span>'
    opposeHtml +=
        '</div><span style="border: 1px solid #ddd; display: block; width: 100%; heighht: 1px;"></span>'
    // neutralHtml +=
    // '</div><span style="border: 1px solid #ddd; display: block; width: 100%; heighht: 1px;"></span>'

    let html = `
        <div>
            <h2 style="font-size: 20px;">${clientName} Legislation Scorecard</h2>    
            <p style="font-size: 16px;">As we closely monitored various bills and their implications, we present this scorecard to highlight the key legislative changes and their impact on our company.</p>
            <p>Below is a summary of the key bills ${clientName} took strong positions on this year and the outcome.</p>
            <h3>
            <span">
            <img src="${process.env.APP_URL}check.png" style="width: 20px; height: 20px; position: relative; top: 3px;"/>
            </span>
            <span style="margin-bottom: 10px;">
                Positive Outcome
            </span>
            </h3>
            <h3>
            <span"><img src="${process.env.APP_URL}cross.png" style="width: 20px; height: 20px ; position: relative; top: 3px;"></span>
                <span style="margin-bottom: 10px;">
                    Negative Outcome
                </span>
            </h3>
        </div>`

    if (supportHtmlExist) {
        html = html + `<div>${supportHtml}</div>`
    }
    if (opposeHtmlExist) {
        html = html + `<div>${opposeHtml}</div>`
    }
    // if (neutralHtmlExist) {
    // html = html + `<div>${neutralHtml}</div>`
    // }

    html = `<div>
            ${html}
            </div>`

    return html
}
