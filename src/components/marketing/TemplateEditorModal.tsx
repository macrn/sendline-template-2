import React from 'react';
import { EmailTemplate, Campaign, EmailSection, AppView } from '../../types';
import { TemplateStudio } from './TemplateStudio';

interface TemplateEditorModalProps {
  initialTemplate?: EmailTemplate | null;
  onClose: () => void;
  onSaveCampaign: (campaign: Campaign) => void;
  onNavigate?: (view: AppView) => void;
  studioMode?: 'campaign' | 'workflow' | 'library';
  workflowContext?: {
    workflowId: string;
    workflowName: string;
    nodeId: string;
    stepTitle: string;
  };
  onSaveToWorkflow?: (template: EmailTemplate, sections: EmailSection[]) => void;
  onSaveToLibrary?: (template: EmailTemplate) => void;
}

export const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  initialTemplate,
  onClose,
  onSaveCampaign,
  onNavigate,
  studioMode = 'campaign',
  workflowContext,
  onSaveToWorkflow,
  onSaveToLibrary
}) => {
  return (
    <TemplateStudio
      initialTemplate={initialTemplate}
      onClose={onClose}
      onSaveCampaign={onSaveCampaign}
      onNavigate={onNavigate}
      studioMode={studioMode}
      workflowContext={workflowContext}
      onSaveToWorkflow={onSaveToWorkflow}
      onSaveToLibrary={onSaveToLibrary}
    />
  );
};

