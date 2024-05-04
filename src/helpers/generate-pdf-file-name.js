export default (bill) => {
    const splitIndex = bill?.bill_version_id?.length - 3
    let firstPart = bill?.bill_version_id.slice(0, splitIndex)
    firstPart = firstPart?.slice(0, firstPart.lastIndexOf(bill?.version_num))
    return `${firstPart}_${bill?.version_num}.pdf`
}
