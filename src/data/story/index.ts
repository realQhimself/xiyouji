import type { StoryNode } from '../types';
import act1Nodes from './act1';
import act2Nodes from './act2';
import act3Nodes from './act3';
import act4Nodes from './act4';
import endingNodes from './endings';

/**
 * 所有故事节点的合并数组（第一幕到第五幕 + 结局入口节点）
 */
export const allStoryNodes: StoryNode[] = [
  ...act1Nodes,
  ...act2Nodes,
  ...act3Nodes,
  ...act4Nodes,
  ...endingNodes,
];

/**
 * 节点 ID → StoryNode 的 O(1) 查找 Map
 *
 * 用法：
 *   import { storyNodeMap } from './data/story';
 *   const node = storyNodeMap.get('4-1');
 */
export const storyNodeMap: Map<string, StoryNode> = new Map(
  allStoryNodes.map((node) => [node.id, node]),
);

// 也单独导出各幕数据，方便按幕调试
export { act1Nodes, act2Nodes, act3Nodes, act4Nodes, endingNodes };
