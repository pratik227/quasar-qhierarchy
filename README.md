# QHierarchy

<!-- Please note, this is currently a work-in-progress (WIP). -->

QHierarchy is a [Quasar App Extension](https://quasar.dev/app-extensions/introduction).  It allows you to display data in hierarchy structure on your page.

## Install

To add this App Extension to your Quasar application, run the following (in your Quasar app folder):

```bash
quasar ext add qhierarchy
```

# Uninstall
To remove this App Extension from your Quasar application, run the following (in your Quasar app folder):

```
quasar ext remove qhierarchy
```


# Defining the columns


    [
        {
            name: 'label',
            label: 'Label',
            align: 'left',
            field: 'label',
            // (optional) tell QHierarchy you want this column sortable
            sortable: true
        },
        {
            name: 'Description',
            label: 'Description',
            sortable: true,
            field: 'description',
            align: 'center',
        },
        {
            name: 'note',
            label: 'Note',
            sortable: true,
            field: 'note',
            align: 'left',
        }
    ],

     
# Defining Data

     [
            {
                label: "Node 1",
                description: "Node 1 description",
                note: "Node 1 note",
                children: [
                    {
                        label: "Node 1.1",
                        description: "Node 1.1 description",
                        note: "Node 1.1 note",
                    },
                    {
                        label: "Node 1.2",
                        description: "Node 1.2 description",
                        note: "Node 1.2 note",
                        children: [
                            {
                                label: "Node 1.2.1",
                                description: "Node 1.2.1 description",
                                note: "Node 1.2.1 note",
                            },
                            {
                                label: "Node 1.2.2",
                                description: "Node 1.2.2 description",
                                note: "Node 1.2.2 note",
                            }
                        ],
                    }
                ],
        }
     ]

# Source

can be found [here](https://github.com/pratik227/quasar-qhierarchy).

# Docs

can be found [here](https://next-quasar-qhierarchy.netlify.app/).

# Demo (source) Project.

can be found [here](https://github.com/pratik227/quasar-qhierarchy/tree/next/demo).

# Sponsors

<p align="center">
  <a href="https://github.com/pratik227/static/blob/main/sponsors.svg">
    <img src='https://github.com/pratik227/static/blob/main/sponsors.svg'/>
  </a>
</p>

# Support

If this helped you in any way, you can contribute to this project for long term survival by supporting me:

### [💜 Support my open-source work on GitHub](https://github.com/sponsors/pratik227)

Be sure to check out my sponsor page.

Thank you so much!!!
