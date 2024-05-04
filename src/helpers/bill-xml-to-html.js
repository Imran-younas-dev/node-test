/* eslint-disable indent */
import { isString } from 'lodash'

const xml2js = require('xml2js')
const cheerio = require('cheerio')

export default async function convertXmlToHtml(xmlContent) {
    try {
        let htmlBillContent
        // let topLevelDescription
        // let xmlBillContent
        let $
        // let xmlDigestHtml
        let digestHtml
        // let finalObject
        let xmlLawSection
        let lawSectionId
        // Parsing XML
        const result = await xml2js.parseStringPromise(xmlContent, {
            explicitChildren: true,
            childkey: 'caml:Description',
            explicitArray: false,
        })

        // Top Level Bill Details
        const topLevelDescription =
            result['caml:MeasureDoc']['caml:Description']['caml:Description'][
                'caml:Description'
            ]

        // Bill Content
        const xmlBillContent =
            result['caml:MeasureDoc']['caml:Description']['caml:Bill'][
                'caml:Description'
            ]
        htmlBillContent = ''
        if (xmlBillContent) {
            // Create HTML of Bill Content
            $ = cheerio.load('<div class="billContent"></div>')
            if (xmlBillContent['caml:Preamble']) {
                $('div.billContent').append(
                    `<h2>${xmlBillContent['caml:Preamble']}</h2>`
                )
            }

            // Loop the bill section to collect and make bill content html
            for (
                let i = 0;
                i < xmlBillContent['caml:BillSection'].length;
                i++
            ) {
                const xmlBillSection = xmlBillContent['caml:BillSection'][i]
                if (xmlBillSection['$']['id']) {
                    $('div.billContent').append(
                        `<div class="${xmlBillSection['$']['id']}"><div>`
                    )
                    // Inner Heading
                    if (xmlBillSection['caml:Description']['caml:Num']) {
                        $(`div.${xmlBillSection['$']['id']}`).append(
                            `<h3>${xmlBillSection['caml:Description']['caml:Num']}</h3>`
                        )
                    }
                    // Inner Content
                    if (
                        xmlBillSection['caml:Description']['caml:ActionLine']?._
                    ) {
                        if (
                            xmlBillSection['caml:Description'][
                                'caml:ActionLine'
                            ]['caml:Description']['caml:DocName']
                        ) {
                            $(`div.${xmlBillSection['$']['id']}`).append(
                                ` ${xmlBillSection['caml:Description'][
                                    'caml:ActionLine'
                                ]?._.replace(
                                    'the , to read:',
                                    'the ' +
                                        xmlBillSection['caml:Description'][
                                            'caml:ActionLine'
                                        ]['caml:Description']['caml:DocName'] +
                                        ', to read:'
                                )}`
                            )
                        } else {
                            $(`div.${xmlBillSection['$']['id']}`).append(
                                ` ${xmlBillSection['caml:Description']['caml:ActionLine']?._}`
                            )
                        }
                    }
                    if (xmlBillSection['caml:Description']['caml:Fragment']) {
                        xmlLawSection =
                            xmlBillSection['caml:Description']['caml:Fragment']
                        // Section div
                        if (
                            xmlLawSection['caml:Description']['caml:LawHeading']
                                ?.$
                        ) {
                            lawSectionId =
                                xmlLawSection['caml:Description'][
                                    'caml:LawHeading'
                                ]['$']['id']
                            $(`div.${xmlBillSection['$']['id']}`).append(
                                `<div class="${lawSectionId}"></div>`
                            )
                            $(`div.${lawSectionId}`).append(
                                `<h4>${xmlLawSection['caml:Description']['caml:LawHeading']['$']['type']} ${xmlLawSection['caml:Description']['caml:LawHeading']['caml:Description']['caml:Num']} ${xmlLawSection['caml:Description']['caml:LawHeading']['caml:Description']['caml:LawHeadingVersion']['caml:Description']['caml:LawHeadingText']}</h4>`
                            )
                            // Inner law blocks
                            if (
                                xmlLawSection['caml:Description'][
                                    'caml:LawHeading'
                                ]['caml:Description']['caml:LawSection']
                            ) {
                                const xmlLawSectionInner =
                                    xmlLawSection['caml:Description'][
                                        'caml:LawHeading'
                                    ]['caml:Description']['caml:LawSection']
                                for (
                                    let j = 0;
                                    j < xmlLawSectionInner.length;
                                    j++
                                ) {
                                    if (xmlLawSectionInner[j]['$']['id']) {
                                        $(`div.${lawSectionId}`).append(
                                            `<div class="${xmlLawSectionInner[j]['$']['id']}"></div>`
                                        )
                                        $(
                                            `div.${xmlLawSectionInner[j]['$']['id']}`
                                        ).append(
                                            `<h5>${xmlLawSectionInner[j]['caml:Description']['caml:Num']}</h5>`
                                        )
                                        const innerP =
                                            xmlLawSectionInner[j][
                                                'caml:Description'
                                            ]['caml:LawSectionVersion'][
                                                'caml:Description'
                                            ]['caml:Content'][
                                                'caml:Description'
                                            ]['p']

                                        if (innerP) {
                                            if (
                                                /* typeof innerP === 'string' */ isString(
                                                    innerP
                                                )
                                            ) {
                                                $(
                                                    `div.${xmlLawSectionInner[j]['$']['id']}`
                                                ).append(
                                                    ` <span>${innerP}</span>`
                                                )
                                            } else {
                                                for (
                                                    let k = 0;
                                                    k < innerP.length;
                                                    k++
                                                ) {
                                                    if (innerP[k]?._) {
                                                        $(
                                                            `div.${xmlLawSectionInner[j]['$']['id']}`
                                                        ).append(
                                                            `<p>${innerP[k]?._}</p>`
                                                        )
                                                    } else {
                                                        $(
                                                            `div.${xmlLawSectionInner[j]['$']['id']}`
                                                        ).append(
                                                            ` <span>${innerP[k]}</span>`
                                                        )
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            const xmlLawSectionInner =
                                xmlLawSection['caml:Description'][
                                    'caml:LawSection'
                                ]
                            // This is related to law section
                            if (
                                xmlLawSection['caml:Description'][
                                    'caml:LawSection'
                                ]
                            ) {
                                if (
                                    xmlLawSection['caml:Description'][
                                        'caml:LawSection'
                                    ]?.$.id
                                ) {
                                    // single set
                                    lawSectionId = xmlBillSection['$']['id']
                                    $(`div.${lawSectionId}`).append(
                                        `<div class="${xmlLawSectionInner['$']['id']}"></div>`
                                    )
                                    $(
                                        `div.${xmlLawSectionInner['$']['id']}`
                                    ).append(
                                        `<h5>${xmlLawSectionInner['caml:Description']['caml:Num']}</h5>`
                                    )
                                    const innerP =
                                        xmlLawSectionInner['caml:Description'][
                                            'caml:LawSectionVersion'
                                        ]['caml:Description']['caml:Content'][
                                            'caml:Description'
                                        ]['p']

                                    if (innerP) {
                                        if (
                                            /* typeof innerP === 'string' */ isString(
                                                innerP
                                            )
                                        ) {
                                            $(
                                                `div.${xmlLawSectionInner['$']['id']}`
                                            ).append(` <span>${innerP}</span>`)
                                        } else {
                                            for (
                                                let k = 0;
                                                k < innerP.length;
                                                k++
                                            ) {
                                                if (innerP[k]?._) {
                                                    $(
                                                        `div.${xmlLawSectionInner['$']['id']}`
                                                    ).append(
                                                        `<p>${innerP[k]?._}</p>`
                                                    )
                                                } else {
                                                    $(
                                                        `div.${xmlLawSectionInner['$']['id']}`
                                                    ).append(
                                                        ` <span>${innerP[k]}</span>`
                                                    )
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    // multipe set
                                    for (
                                        let j = 0;
                                        j < xmlLawSectionInner.length;
                                        j++
                                    ) {
                                        if (xmlLawSectionInner[j]['$']['id']) {
                                            $(`div.${lawSectionId}`).append(
                                                `<div class="${xmlLawSectionInner[j]['$']['id']}"></div>`
                                            )
                                            $(
                                                `div.${xmlLawSectionInner[j]['$']['id']}`
                                            ).append(
                                                `<h5>${xmlLawSectionInner[j]['caml:Description']['caml:Num']}</h5>`
                                            )
                                            const innerP =
                                                xmlLawSectionInner[j][
                                                    'caml:Description'
                                                ]['caml:LawSectionVersion'][
                                                    'caml:Description'
                                                ]['caml:Content'][
                                                    'caml:Description'
                                                ]['p']

                                            if (innerP) {
                                                if (
                                                    /* typeof innerP === 'string' */
                                                    isString(innerP)
                                                ) {
                                                    $(
                                                        `div.${xmlLawSectionInner[j]['$']['id']}`
                                                    ).append(
                                                        ` <span>${innerP}</span>`
                                                    )
                                                } else {
                                                    for (
                                                        let k = 0;
                                                        k < innerP.length;
                                                        k++
                                                    ) {
                                                        if (innerP[k]?._) {
                                                            $(
                                                                `div.${xmlLawSectionInner[j]['$']['id']}`
                                                            ).append(
                                                                `<p>${innerP[k]?._}</p>`
                                                            )
                                                        } else {
                                                            $(
                                                                `div.${xmlLawSectionInner[j]['$']['id']}`
                                                            ).append(
                                                                ` <span>${innerP[k]}</span>`
                                                            )
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (xmlLawSection['caml:Description']['caml:BudgetItem']) {
                        /* console.log(
                            xmlLawSection['caml:Description']['caml:BudgetItem']
                        )*/
                    }
                    // Inner Content Law Block
                    if (xmlBillSection['caml:Description']['caml:Content']) {
                        const innerContentBlock =
                            xmlBillSection['caml:Description']['caml:Content'][
                                'caml:Description'
                            ]['p']
                        if (innerContentBlock?._) {
                            $(`div.${xmlBillSection['$']['id']}`).append(
                                `<p>${innerContentBlock?._.replace(
                                    /\n/g,
                                    ' '
                                ).replace(/\t/g, ' ')}</p>`
                            )
                        } else {
                            for (let n = 0; n < innerContentBlock.length; n++) {
                                $(`div.${xmlBillSection['$']['id']}`).append(
                                    `<p>${innerContentBlock[n]}</p>`
                                )
                            }
                        }
                    }
                }
            }
            // html bill content will be available in this variable.
            htmlBillContent = $.html('body div.billContent')
        }

        // Create history object
        const xmlHistory =
            topLevelDescription['caml:History']['caml:Description'][
                'caml:Action'
            ]
        const history = []
        if (xmlHistory.length > 0) {
            for (let h = 0; h < xmlHistory.length; h++) {
                const hData = {
                    action: xmlHistory[h]['caml:Description'][
                        'caml:ActionText'
                    ],
                    date: xmlHistory[h]['caml:Description']['caml:ActionText'],
                }
                history.push(hData)
            }
        }
        // Create lead author object
        const xmlLeadAuthor = topLevelDescription['caml:AuthorText']
        const leadAuthor = []
        if (xmlLeadAuthor.length > 0) {
            for (let l = 0; l < xmlLeadAuthor.length; l++) {
                if (xmlLeadAuthor[l]?._) leadAuthor.push(xmlLeadAuthor[l]?._)
            }
        }
        // Create author object
        const xmlAuthors =
            topLevelDescription['caml:Authors']['caml:Description'][
                'caml:Legislator'
            ]
        const authors = []
        if (xmlAuthors.length > 0) {
            for (let a = 0; a < xmlAuthors.length; a++) {
                if (xmlAuthors[a]['caml:Description']) {
                    const aObject = {
                        contribution:
                            xmlAuthors[a]['caml:Description'][
                                'caml:Contribution'
                            ],
                        house: xmlAuthors[a]['caml:Description']['caml:House'],
                        name: xmlAuthors[a]['caml:Description']['caml:Name'],
                    }
                    authors.push(aObject)
                }
            }
        }
        // Create digest html
        const xmlDigestHtml =
            topLevelDescription['caml:DigestText']['caml:Description']['p']
        if (xmlDigestHtml) {
            $ = cheerio.load('<div class="digestContent"></div>')
            if (xmlDigestHtml.length > 0) {
                for (let d = 0; d < xmlDigestHtml.length; d++) {
                    $('div.digestContent').append(`<p>${xmlDigestHtml[d]}</p>`)
                }
            }
            digestHtml = $.html('body div.digestContent')
        } else {
            digestHtml = ''
        }

        // Access the Title directly
        const finalObject = {
            title: topLevelDescription['caml:Title']
                ? topLevelDescription['caml:Title']
                : '',
            versionNum: topLevelDescription['caml:VersionNum']
                ? topLevelDescription['caml:VersionNum']
                : '',
            history: history,
            legislativeInfo: {
                sessionYear: topLevelDescription['caml:LegislativeInfo'][
                    'caml:Description'
                ]['caml:SessionYear']
                    ? topLevelDescription['caml:LegislativeInfo'][
                          'caml:Description'
                      ]['caml:SessionYear']
                    : '',
                sessionNum: topLevelDescription['caml:LegislativeInfo'][
                    'caml:Description'
                ]['caml:SessionNum']
                    ? topLevelDescription['caml:LegislativeInfo'][
                          'caml:Description'
                      ]['caml:SessionNum']
                    : '',
                measureType: topLevelDescription['caml:LegislativeInfo'][
                    'caml:Description'
                ]['caml:MeasureType']
                    ? topLevelDescription['caml:LegislativeInfo'][
                          'caml:Description'
                      ]['caml:MeasureType']
                    : '',
                measureNum: topLevelDescription['caml:LegislativeInfo'][
                    'caml:Description'
                ]['caml:MeasureNum']
                    ? topLevelDescription['caml:LegislativeInfo'][
                          'caml:Description'
                      ]['caml:MeasureNum']
                    : '',
                measureState: topLevelDescription['caml:LegislativeInfo'][
                    'caml:Description'
                ]['caml:MeasureState']
                    ? topLevelDescription['caml:LegislativeInfo'][
                          'caml:Description'
                      ]['caml:MeasureState']
                    : '',
            },
            leadAuthor: leadAuthor,
            authors: authors,
            relatingClause: topLevelDescription['caml:RelatingClause']
                ? topLevelDescription['caml:RelatingClause']
                : '',
            generalSubject: topLevelDescription['caml:GeneralSubject'][
                'caml:Description'
            ]['caml:Subject']
                ? topLevelDescription['caml:GeneralSubject'][
                      'caml:Description'
                  ]['caml:Subject']
                : '',
            digestHtml: digestHtml,
            digestKey: {
                voteRequired: topLevelDescription['caml:DigestKey'][
                    'caml:Description'
                ]['caml:VoteRequired']
                    ? topLevelDescription['caml:DigestKey']['caml:Description'][
                          'caml:VoteRequired'
                      ]
                    : '',
                appropriation: topLevelDescription['caml:DigestKey'][
                    'caml:Description'
                ]['caml:Appropriation']
                    ? topLevelDescription['caml:DigestKey']['caml:Description'][
                          'caml:Appropriation'
                      ]
                    : '',
                fiscalCommittee: topLevelDescription['caml:DigestKey'][
                    'caml:Description'
                ]['caml:FiscalCommittee']
                    ? topLevelDescription['caml:DigestKey']['caml:Description'][
                          'caml:FiscalCommittee'
                      ]
                    : '',
                localProgram: topLevelDescription['caml:DigestKey'][
                    'caml:Description'
                ]['caml:LocalProgram']
                    ? topLevelDescription['caml:DigestKey']['caml:Description'][
                          'caml:LocalProgram'
                      ]
                    : '',
            },
            measureIndicators: {
                immediateEffect: topLevelDescription['caml:MeasureIndicators'][
                    'caml:Description'
                ]['caml:ImmediateEffect']
                    ? topLevelDescription['caml:MeasureIndicators'][
                          'caml:Description'
                      ]['caml:ImmediateEffect']
                    : '',
                immediateEffectFlags: {
                    urgency: topLevelDescription['caml:MeasureIndicators'][
                        'caml:Description'
                    ]['caml:ImmediateEffectFlags']['caml:Description'][
                        'caml:Urgency'
                    ]
                        ? topLevelDescription['caml:MeasureIndicators'][
                              'caml:Description'
                          ]['caml:ImmediateEffectFlags']['caml:Description'][
                              'caml:Urgency'
                          ]
                        : '',
                    taxLevy: topLevelDescription['caml:MeasureIndicators'][
                        'caml:Description'
                    ]['caml:ImmediateEffectFlags']['caml:Description'][
                        'caml:TaxLevy'
                    ]
                        ? topLevelDescription['caml:MeasureIndicators'][
                              'caml:Description'
                          ]['caml:ImmediateEffectFlags']['caml:Description'][
                              'caml:TaxLevy'
                          ]
                        : '',
                    election: topLevelDescription['caml:MeasureIndicators'][
                        'caml:Description'
                    ]['caml:ImmediateEffectFlags']['caml:Description'][
                        'caml:Election'
                    ]
                        ? topLevelDescription['caml:MeasureIndicators'][
                              'caml:Description'
                          ]['caml:ImmediateEffectFlags']['caml:Description'][
                              'caml:Election'
                          ]
                        : '',
                    usualCurrentExpenses: topLevelDescription[
                        'caml:MeasureIndicators'
                    ]['caml:Description']['caml:ImmediateEffectFlags'][
                        'caml:Description'
                    ]['caml:UsualCurrentExpenses']
                        ? topLevelDescription['caml:MeasureIndicators'][
                              'caml:Description'
                          ]['caml:ImmediateEffectFlags']['caml:Description'][
                              'caml:UsualCurrentExpenses'
                          ]
                        : '',
                    budgetBill: topLevelDescription['caml:MeasureIndicators'][
                        'caml:Description'
                    ]['caml:ImmediateEffectFlags']['caml:Description'][
                        'caml:BudgetBill'
                    ]
                        ? topLevelDescription['caml:MeasureIndicators'][
                              'caml:Description'
                          ]['caml:ImmediateEffectFlags']['caml:Description'][
                              'caml:BudgetBill'
                          ]
                        : '',
                    prop25TrailerBill: topLevelDescription[
                        'caml:MeasureIndicators'
                    ]['caml:Description']['caml:ImmediateEffectFlags'][
                        'caml:Description'
                    ]['caml:Prop25TrailerBill']
                        ? topLevelDescription['caml:MeasureIndicators'][
                              'caml:Description'
                          ]['caml:ImmediateEffectFlags']['caml:Description'][
                              'caml:Prop25TrailerBill'
                          ]
                        : '',
                },
            },
            htmlBillContent: htmlBillContent,
        }
        return finalObject
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        return ''
    }
}
