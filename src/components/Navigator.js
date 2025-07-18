import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";

export default function DynamicRichTreeView() {
  const REACT_API_URL = process.env.REACT_APP_API_URL;

  const [treeItems, setTreeItems] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${REACT_API_URL}/connect/getConnections`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = res.data.map((conn) => ({
        id: `conn-${conn.id}`,
        label: String(conn.name || `Connection ${conn.id}`),
        connId: conn.id,
        children: [{ id: `loading-${conn.id}`, label: "Loading..." }], // placeholder
      }));

      setTreeItems(items);
    } catch (err) {
      console.error("Error fetching connections", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // Expand handler
  const handleItemToggle = async (event, itemIds) => {
    const newlyExpandedId = itemIds.find((id) => !expanded.includes(id));
    setExpanded(itemIds);

    const connPrefix = "conn-";
    const dbPrefix = "db-";

    const node = findNodeById(treeItems, newlyExpandedId);

    // 1. Expand connection node → load databases
    if (newlyExpandedId?.startsWith(connPrefix)) {
      const connId = node?.connId;
      if (node && node.children?.[0]?.id?.startsWith("loading")) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${REACT_API_URL}/catalogs?id=${connId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const dbChildren = res.data.map((dbObj, index) => {
            const dbName = dbObj.catalog || dbObj.name || `db-${index}`;
            return {
              id: `db-${connId}-${dbName}`,
              label: dbName,
              children: [{ id: `loading-db-${dbName}`, label: "Loading..." }],
              dbName,
              connId,
            };
          });

          const updatedTree = updateNodeChildren(
            treeItems,
            newlyExpandedId,
            dbChildren
          );
          setTreeItems(updatedTree);
        } catch (err) {
          console.error("Error fetching databases", err);
          const updatedTree = updateNodeChildren(treeItems, newlyExpandedId, [
            {
              id: `error-db-${node.connId}`,
              label: "Failed to load databases",
              children: [],
            },
          ]);
          setTreeItems(updatedTree);
        }
      }
    }

    // 2. Expand database node → load schemas
    else if (newlyExpandedId?.startsWith(dbPrefix)) {
      const connId = node?.connId;
      const dbName = node?.dbName;

      if (node && node.children?.[0]?.id?.startsWith("loading")) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${REACT_API_URL}/schemas?id=${connId}&dbName=${dbName}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          let schemaChildren;

          if (res.data.length === 0) {
            // No schemas (MySQL) → Directly fetch tables under the database
            const token = localStorage.getItem("token");
            const tablesRes = await axios.get(
              `${REACT_API_URL}/tables?id=${connId}&database=${dbName}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            schemaChildren = tablesRes.data.map((tableObj) => {
              const tableName =
                tableObj.tableName || tableObj.name || "UnnamedTable";
              return {
                id: `table-${connId}-${dbName}-null-${tableName}`,
                label: tableName,
                children: [
                  {
                    id: `loading-cols-${connId}-${dbName}-null-${tableName}`,
                    label: "Loading...",
                  },
                ],
                tableName,
                schemaName: null,
                dbName,
                connId,
              };
            });
          } else {
            // Normal DB (PostgreSQL, SQL Server) → Has schemas
            schemaChildren = res.data.map((schemaObj) => {
              const schemaName = schemaObj.name || "UnnamedSchema";

              return {
                id: `schema-${connId}-${dbName}-${schemaName}`,
                label: schemaName,
                children: [
                  {
                    id: `loading-schema-${connId}-${dbName}-${schemaName}`,
                    label: "Loading...",
                  },
                ],
                schemaName,
                dbName,
                connId,
              };
            });
          }

          const updatedTree = updateNodeChildren(
            treeItems,
            newlyExpandedId,
            schemaChildren
          );
          setTreeItems(updatedTree);
        } catch (err) {
          console.error("Error fetching schemas", err);
          const updatedTree = updateNodeChildren(treeItems, newlyExpandedId, [
            {
              id: `error-schema-${connId}-${dbName}`,
              label: "Failed to load schemas",
              children: [],
            },
          ]);
          setTreeItems(updatedTree);
        }
      }
    }

    else if (newlyExpandedId?.startsWith("schema-")) {
      const { connId, dbName, schemaName } = node;

      if (node && node.children?.[0]?.id?.startsWith("loading")) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${REACT_API_URL}/tables?id=${connId}&database=${dbName}&schema=${schemaName}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const tables = res.data || [];

          // Avoid duplicate IDs
          const uniqueTableChildren = tables.map((tableObj) => {
            const tableName =
              tableObj.tableName || tableObj.name || "UnnamedTable";
            return {
              id: `table-${connId}-${dbName}-${schemaName}-${tableName}`,
              label: tableName,
              children: [
                {
                  id: `loading-cols-${connId}-${dbName}-${schemaName}-${tableName}`,
                  label: "Loading...",
                },
              ],
              tableName,
              schemaName,
              dbName,
              connId,
            };
          });

          const updatedTree = updateNodeChildren(
            treeItems,
            newlyExpandedId,
            uniqueTableChildren
          );
          setTreeItems(updatedTree);
        } catch (err) {
          console.error("Error fetching tables", err);
          const updatedTree = updateNodeChildren(treeItems, newlyExpandedId, [
            {
              id: `error-table-${connId}-${dbName}-${schemaName}`,
              label: "Failed to load tables",
              children: [],
            },
          ]);
          setTreeItems(updatedTree);
        }
      }
    } else if (newlyExpandedId?.startsWith("table-")) {
      const { connId, dbName, schemaName, tableName } = node;

      if (node && node.children?.[0]?.id?.startsWith("loading")) {
        try {
          const token = localStorage.getItem("token");

          const res = await axios.get(
            `${REACT_API_URL}/columns?id=${connId}&database=${dbName}&schema=${schemaName}&table=${tableName}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const columns = res.data || [];

          const columnChildren = columns.map((colObj) => {
            const colName = colObj.columnName || colObj.name || "UnnamedColumn";
            return {
              id: `col-${connId}-${dbName}-${
                schemaName || "null"
              }-${tableName}-${colName}`,
              label: colName,
              children: [], 
            };
          });

          const updatedTree = updateNodeChildren(
            treeItems,
            newlyExpandedId,
            columnChildren
          );
          setTreeItems(updatedTree);
        } catch (err) {
          console.error("Error fetching columns", err);
          const updatedTree = updateNodeChildren(treeItems, newlyExpandedId, [
            {
              id: `error-cols-${connId}-${dbName}-${schemaName}-${tableName}`,
              label: "Failed to load columns",
              children: [],
            },
          ]);
          setTreeItems(updatedTree);
        }
      }
    }
  };

  // Helper: find a node by id
  const findNodeById = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateNodeChildren = (nodes, id, newChildren) => {
    return nodes.map((node) => {
      if (node.id === id) {
        return { ...node, children: newChildren };
      } else if (node.children?.length) {
        return {
          ...node,
          children: updateNodeChildren(node.children, id, newChildren),
        };
      }
      return node;
    });
  };

  return (
    <Box sx={{ minHeight: 400, minWidth: 300 }}>
      <RichTreeView
        items={treeItems}
        expandedItems={expanded}
        onExpandedItemsChange={handleItemToggle}
      />
    </Box>
  );
}
