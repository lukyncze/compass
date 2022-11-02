import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
  Body,
  css,
  SpinLoader,
  DocumentIcon,
  spacing,
  Overline,
} from '@mongodb-js/compass-components';
import type { RootState } from '../../../modules';
import type { Document } from 'mongodb';
import { DocumentListView } from '@mongodb-js/compass-crud';
import HadronDocument from 'hadron-document';
import { PipelineOutputOptionsMenu } from '../../pipeline-output-options-menu';
import type { PipelineOutputOption } from '../../pipeline-output-options-menu';
import { getPipelineStageOperatorsFromBuilderState } from '../../../modules/pipeline-builder/builder-helpers';
import { OutputStageBanner } from './pipeline-stages-preview';

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const previewHeaderStyles = css({
  padding: spacing[3],
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
});

const centerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: spacing[3],
  textAlign: 'center',
});

const messageStyles = css({ marginTop: spacing[3] });

const documentListStyles = css({
  overflow: 'auto',
});

const pipelineOutputMenuStyles = css({
  marginTop: 0,
  marginRight: 0,
  marginBottom: 'auto',
  marginLeft: 'auto',
});
const outputStageStyles = css({
  marginTop: 'auto',
});

type PipelinePreviewProps = {
  isLoading: boolean;
  isMergeStage: boolean;
  isOutStage: boolean;
  previewDocs: Document[] | null;
};

const PreviewResults = ({
  previewDocs,
  isLoading,
  isExpanded,
}: {
  previewDocs: Document[] | null;
  isLoading: boolean;
  isExpanded: boolean;
}) => {
  const listProps: React.ComponentProps<typeof DocumentListView> = useMemo(
    () => ({
      docs: (previewDocs ?? []).map((doc) => new HadronDocument(doc)),
      isEditable: false,
      copyToClipboard(doc) {
        const str = doc.toEJSON();
        void navigator.clipboard.writeText(str);
      },
    }),
    [previewDocs]
  );

  if (isLoading) {
    return (
      <div className={centerStyles}>
        <SpinLoader size="24px" />
      </div>
    );
  }

  if (!previewDocs) {
    return (
      <div className={centerStyles}>
        <DocumentIcon />
        <Body className={messageStyles}>
          Preview results to see a sample of the aggregated results from this
          pipeline.
        </Body>
      </div>
    );
  }

  if (previewDocs.length === 0) {
    return (
      <div className={centerStyles}>
        <DocumentIcon />
        <Body className={messageStyles}>No preview documents</Body>
      </div>
    );
  }

  return (
    <div className={documentListStyles}>
      <DocumentListView {...listProps} isExpanded={isExpanded} />
    </div>
  );
};

export const PipelinePreview: React.FunctionComponent<PipelinePreviewProps> = ({
  isLoading,
  isMergeStage,
  isOutStage,
  previewDocs,
}) => {
  const [pipelineOutputOption, setPipelineOutputOption] =
    useState<PipelineOutputOption>('collapse');
  const isExpanded = pipelineOutputOption === 'expand';

  const docCount = previewDocs?.length ?? 0;
  const docText = docCount === 1 ? 'document' : 'documents';
  const shouldShowCount = !isLoading && docCount > 0;
  const stageOperator = isMergeStage ? '$merge' : isOutStage ? '$out' : null
  return (
    <div className={containerStyles} data-testid="pipeline-as-text-preview">
      <div className={previewHeaderStyles}>
        <div>
          <Overline>Pipeline Output</Overline>
          {shouldShowCount && <Body>Sample of ${docCount} ${docText}</Body>}
        </div>
        <div className={pipelineOutputMenuStyles}>
          <PipelineOutputOptionsMenu
            option={pipelineOutputOption}
            onChangeOption={setPipelineOutputOption}
          />
        </div>
      </div>
      <PreviewResults
        isExpanded={isExpanded}
        isLoading={isLoading}
        previewDocs={previewDocs}
      />
      <div className={outputStageStyles} data-testid="output-stage-preview">
        <OutputStageBanner stageOperator={stageOperator} />
      </div>
    </div>
  );
};

const mapState = (state: RootState) => {
  const pipeline = getPipelineStageOperatorsFromBuilderState(state);
  const lastStage = pipeline[pipeline.length - 1] ?? '';
  const { isLoading, previewDocs } = state.pipelineBuilder.textEditor.pipeline;
  return {
    isLoading,
    previewDocs,
    isMergeStage: lastStage === '$merge',
    isOutStage: lastStage === '$out',
  };
};

export default connect(mapState)(PipelinePreview);
