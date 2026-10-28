/**
 * Cây danh mục chỉ vài chục node và API /categories trả nguyên cây (không phân trang)
 * nên tìm kiếm/lọc/tính đường dẫn làm trên client — không vi phạm Rule 3 (sort server-side
 * chỉ bắt buộc với danh sách có pagination).
 */

const lower = (value) => String(value || "").toLowerCase();

// Giữ node khớp (kèm nguyên nhánh con) hoặc node có cháu khớp — để còn ngữ cảnh cha
export const filterTree = (nodes = [], term = "") => {
  const q = term.trim().toLowerCase();
  if (!q) return nodes;
  const walk = (list) =>
    list.reduce((acc, node) => {
      const children = walk(node.children || []);
      const matched = lower(node.name).includes(q) || lower(node.slug).includes(q);
      if (matched || children.length) {
        acc.push({ ...node, children: matched ? node.children || [] : children });
      }
      return acc;
    }, []);
  return walk(nodes);
};

// Lọc theo trạng thái hiển thị: node không khớp nhưng có cháu khớp vẫn giữ làm ngữ cảnh
export const filterTreeByStatus = (nodes = [], wantActive) => {
  const walk = (list) =>
    list.reduce((acc, node) => {
      const children = walk(node.children || []);
      if (!!node.is_active === wantActive || children.length) acc.push({ ...node, children });
      return acc;
    }, []);
  return walk(nodes);
};

export const findNode = (nodes = [], id) => {
  if (id === null || id === undefined) return null;
  for (const node of nodes) {
    if (Number(node.id) === Number(id)) return node;
    const hit = findNode(node.children || [], id);
    if (hit) return hit;
  }
  return null;
};

// Đường dẫn gốc → node, dùng cho breadcrumb và nhãn "cha" của danh mục con
export const getPath = (nodes = [], id) => {
  const walk = (list, trail) => {
    for (const node of list) {
      const next = [...trail, node];
      if (Number(node.id) === Number(id)) return next;
      const hit = walk(node.children || [], next);
      if (hit) return hit;
    }
    return null;
  };
  return walk(nodes, []) || [];
};

// Không được chọn chính mình hoặc con/cháu của mình làm cha (gây vòng tròn)
export const collectSelfAndDescendantIds = (node) => [
  Number(node.id),
  ...(node.children || []).flatMap(collectSelfAndDescendantIds),
];

export const countNodes = (nodes = []) =>
  nodes.reduce((sum, node) => sum + 1 + countNodes(node.children || []), 0);

// id của node có con — dùng cho nút "Thu gọn tất cả"
export const collectExpandableIds = (nodes = []) =>
  nodes.flatMap((node) =>
    node.children?.length ? [Number(node.id), ...collectExpandableIds(node.children)] : [],
  );
