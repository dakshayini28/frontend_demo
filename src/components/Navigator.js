import React from "react";
import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";

const STATIC_TREE_DATA = [
  {
    id: 'conn-1',
    label: 'MySQL Connection',
    children: [
      {
        id: 'db-1-sakila',
        label: 'databases',
        children: [
          {
            id: 'db-1',
            label: 'db1',
            children: [
              { 
                id: 'table1', 
                label: 'tables' ,
                children:[{
                    id:'tb-1',
                    label:'tb-1',
                    children:[
                        {
                            id:'col',
                            label:'columns',
                            children:[
                                {id:'col1',
                                 label:'col1',
                                 children:[]
                                }
                            ]
                        }
                    ]
                }]
            }
            ],
          },
           {
            id: 'db-22',
            label: 'db2',
            children: [
              { 
                id: 'table22', 
                label: 'tables' ,
                children:[{
                    id:'tb-22',
                    label:'tb-2',
                    children:[
                        {
                            id:'col11',
                            label:'columns',
                            children:[
                                {id:'col19',
                                 label:'col1',
                                 children:[]
                                }
                            ]
                        }
                    ]
                }]
            }
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'conn-2',
    label: 'PostgreSQL Connection',
    children: [
      {
        id: 'db-2-public',
        label: 'public',
        children: [
          {
            id: 'tbl-2-public-orders',
            label: 'orders',
            children: [
              { id: 'col-2-public-orders-id', label: 'id (SERIAL)' },
              { id: 'col-2-public-orders-date', label: 'order_date (DATE)' },
            ],
          },
        ],
      },
    ],
  },
];

export default function StaticRichTreeView() {

  return (
    <Box sx={{ minHeight: 400, minWidth: 300 }}>
      <RichTreeView
        items={STATIC_TREE_DATA}
        defaultExpandedItems={['conn-1', 'db-1-sakila']} 
      />
    </Box>
  );
}
