export default {
    xlsxColumns: `/*[
    {
        accessor: 'content.name',
        header: 'Название',
        size: 70
    },
    {
        accessor: 'company.content.legal.name',
        header: 'Юр. лицо',
        size: 80
    }
]*/`,
    filters: `[{equals: { 'content.firstName': 'Родион' }}]`,
    sorts: `[{ content.lastName: 'asc' },{ content.firstName: 'asc' }}]`,
    options: `[{ size: 100 }]`,
    numbroFormat: `/* This is default. You need to override it.
[{
        thousandSeparated: true
}]*/`,
}