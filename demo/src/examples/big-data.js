// Generates a large org-chart style tree: regions > offices > teams > people.

const FIRST = ['Ava', 'Liam', 'Mia', 'Noah', 'Zoe', 'Arjun', 'Ines', 'Kenji', 'Lena', 'Omar', 'Priya', 'Sven', 'Tara', 'Yusuf', 'Elif', 'Mateo']
const LAST = ['Patel', 'Garcia', 'Kim', 'Nowak', 'Okafor', 'Rossi', 'Silva', 'Tanaka', 'Weber', 'Haddad', 'Larsen', 'Moreau']
const ROLES = ['Engineer', 'Designer', 'Product manager', 'Analyst', 'Researcher', 'Support lead']

/**
 * @param {number} target approximate number of nodes (1k, 10k, 100k)
 */
export function makeOrgTree (target) {
  const regions = target >= 100000 ? 20 : (target >= 10000 ? 10 : 4)
  const offices = target >= 100000 ? 10 : (target >= 10000 ? 8 : 5)
  const teams = 5
  const people = Math.max(1, Math.round(target / (regions * offices * teams)) - 1)

  let seq = 0
  const nodes = []
  for (let r = 0; r < regions; r++) {
    const region = { id: ++seq, name: `Region ${r + 1}`, role: 'Region', headcount: 0, children: [] }
    for (let o = 0; o < offices; o++) {
      const office = { id: ++seq, name: `Office ${r + 1}.${o + 1}`, role: 'Office', headcount: 0, children: [] }
      for (let t = 0; t < teams; t++) {
        const team = { id: ++seq, name: `Team ${r + 1}.${o + 1}.${t + 1}`, role: 'Team', headcount: people, children: [] }
        for (let p = 0; p < people; p++) {
          const i = seq + p
          team.children.push({
            id: ++seq,
            name: `${FIRST[i % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`,
            role: ROLES[i % ROLES.length],
            headcount: 1
          })
        }
        office.headcount += people
        office.children.push(team)
      }
      region.headcount += office.headcount
      region.children.push(office)
    }
    nodes.push(region)
  }
  return { nodes, count: seq }
}

export const orgColumns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true, filterable: true },
  { name: 'role', label: 'Role', field: 'role', align: 'left', sortable: true, filterable: true },
  { name: 'headcount', label: 'Headcount', field: 'headcount', align: 'right', sortable: true, sortingType: 'number' }
]
