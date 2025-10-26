import { Node } from 'reactflow';
import { Template } from './templates';

export type ProgressMetrics = {
  completeness: number; // 0-100
  successProbability: number; // 0-100
  missingItems: string[];
  nodeTypeCounts: Record<string, number>;
};

/**
 * Check if a node is properly filled out
 */
function isNodeComplete(node: Node): boolean {
  const data = node.data || {};
  const label = data.label || '';
  const description = data.description || '';
  
  // Node must have a meaningful label (not default)
  if (!label || label.trim().length < 3) return false;
  
  // Node must have a description with substance
  if (!description || description.trim().length < 20) return false;
  
  // For data model nodes, check if fields are defined
  if (node.type === 'datamodel') {
    const fields = data.fields || [];
    if (!Array.isArray(fields) || fields.length === 0) return false;
  }
  
  // For technical nodes, check if technology is specified
  if (node.type === 'technical') {
    const technology = data.technology || '';
    if (!technology || technology.trim().length < 3) return false;
  }
  
  return true;
}

/**
 * Calculate specification completeness based on template requirements AND node quality
 */
export function calculateProgress(
  nodes: Node[],
  template: Template
): ProgressMetrics {
  const nodeTypeCounts: Record<string, number> = {};
  const completeNodeCounts: Record<string, number> = {};
  const missingItems: string[] = [];

  // Count nodes by type and check completion
  nodes.forEach((node) => {
    const type = node.type || 'unknown';
    nodeTypeCounts[type] = (nodeTypeCounts[type] || 0) + 1;
    
    if (isNodeComplete(node)) {
      completeNodeCounts[type] = (completeNodeCounts[type] || 0) + 1;
    }
  });

  // Calculate completeness based on required node types AND quality
  let totalRequired = 0;
  let totalMet = 0;

  if (template.requiredNodeTypes && template.requiredNodeTypes.length > 0) {
    template.requiredNodeTypes.forEach((requirement) => {
      const totalCount = nodeTypeCounts[requirement.type] || 0;
      const completeCount = completeNodeCounts[requirement.type] || 0;
      const met = Math.min(completeCount, requirement.minCount);
      
      totalRequired += requirement.minCount;
      totalMet += met;

      // Provide detailed feedback
      if (completeCount < requirement.minCount) {
        const incompleteCount = totalCount - completeCount;
        if (totalCount < requirement.minCount) {
          const missing = requirement.minCount - totalCount;
          missingItems.push(
            `Add ${missing} more ${requirement.label}`
          );
        }
        if (incompleteCount > 0) {
          missingItems.push(
            `Complete ${incompleteCount} ${requirement.label} (add descriptions & details)`
          );
        }
      }
    });

    // Calculate as percentage (stricter now)
    const completeness = totalRequired > 0 
      ? Math.round((totalMet / totalRequired) * 100)
      : 0;

    // Calculate success probability based on multiple factors
    const successProbability = calculateSuccessProbability(
      nodes,
      completeness,
      nodeTypeCounts,
      completeNodeCounts
    );

    return {
      completeness,
      successProbability,
      missingItems,
      nodeTypeCounts,
    };
  }

  // For blank template or templates without requirements
  const nodeCount = nodes.length;
  const completeNodeCount = nodes.filter(isNodeComplete).length;
  const baseCompleteness = nodeCount > 0 
    ? Math.round((completeNodeCount / Math.max(5, nodeCount)) * 100)
    : 0;
  
  if (completeNodeCount < 5) {
    missingItems.push(`Complete ${5 - completeNodeCount} more nodes with detailed descriptions`);
  }
  
  return {
    completeness: baseCompleteness,
    successProbability: calculateSuccessProbability(nodes, baseCompleteness, nodeTypeCounts, completeNodeCounts),
    missingItems,
    nodeTypeCounts,
  };
}

/**
 * Calculate success probability based on multiple factors
 */
function calculateSuccessProbability(
  nodes: Node[],
  completeness: number,
  nodeTypeCounts: Record<string, number>,
  completeNodeCounts: Record<string, number>
): number {
  if (nodes.length === 0) return 0;
  
  // Base probability heavily on actual completeness (70%)
  let probability = completeness * 0.7;

  // Node quality factor (20%)
  const totalNodes = nodes.length;
  const completeNodes = Object.values(completeNodeCounts).reduce((a, b) => a + b, 0);
  const qualityRatio = totalNodes > 0 ? completeNodes / totalNodes : 0;
  probability += qualityRatio * 20;

  // Diversity bonus - having different node types (5%)
  const typeCount = Object.keys(nodeTypeCounts).length;
  const diversityBonus = Math.min(5, typeCount * 1.25);
  probability += diversityBonus;

  // Minimum nodes threshold (5%)
  if (totalNodes >= 5) {
    probability += 5;
  } else {
    probability += (totalNodes / 5) * 5;
  }

  // Cap at 100
  return Math.min(100, Math.round(probability));
}

/**
 * Get color for completeness/probability percentage
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-500';
  if (percentage >= 60) return 'text-blue-500';
  if (percentage >= 40) return 'text-yellow-500';
  return 'text-red-500';
}

/**
 * Get background color for progress bar
 */
export function getProgressBarColor(percentage: number): string {
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-blue-500';
  if (percentage >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

