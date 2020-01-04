# QHierarchy


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

can be found [here](https://quasar-qhierarchy.surge.sh).

# Examples

can be found [here](https://quasar-qhierarchy.surge.sh).

# Demo (source) Project.

can be found [here](https://github.com/pratik227/quasar-qhierarchy/tree/master/demo).

