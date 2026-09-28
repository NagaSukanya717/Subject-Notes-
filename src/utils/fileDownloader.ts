import { StudyMaterial } from '../types';

/**
 * Generates and triggers a real document download for the student with clean formatted academic notes
 */
export function triggerMaterialDownload(material: StudyMaterial): Promise<void> {
  return new Promise((resolve) => {
    // Generate readable study text bundle
    const header = `================================================================================
STUDYVAULT ACADEMIC REPOSITORY
Document: ${material.title}
Subject: ${material.subjectCode} - ${material.subjectName}
Branch: ${material.branchName} (Semester ${material.semester}, Year ${material.year})
Unit: ${material.unit === 'all' ? 'All Units' : `Unit ${material.unit}`}
Material Type: ${material.materialType.replace('_', ' ').toUpperCase()}
Uploader: ${material.uploaderName} (${material.uploaderRole})
File Reference: ${material.fileName} (${material.fileSize})
Verified Rating: ${material.rating} / 5.0 (${material.reviewsCount} student reviews)
Tags: ${material.tags.map((t) => '#' + t).join(' ')}
Date of Publication: ${material.uploadDate}
================================================================================\n\n`;

    const body = material.pages
      .map((p) => {
        let pageText = `--------------------------------------------------------------------------------\nPAGE ${p.pageNumber}: ${p.title.toUpperCase()}\n--------------------------------------------------------------------------------\n`;
        pageText += `SUMMARY:\n${p.summary}\n\n`;
        pageText += `LECTURE CONTENT:\n${p.content.map((c) => '• ' + c).join('\n')}\n\n`;

        if (p.keyPoints && p.keyPoints.length > 0) {
          pageText += `KEY TAKEAWAYS:\n${p.keyPoints.map((k) => '✓ ' + k).join('\n')}\n\n`;
        }

        if (p.examTip) {
          pageText += `EXAM STRATEGY & TIP:\n⚠ ${p.examTip}\n\n`;
        }

        if (p.codeSnippet) {
          pageText += `CODE SNIPPET (${p.codeSnippet.language.toUpperCase()}):\n${p.codeSnippet.code}\n\n`;
        }

        if (p.tableData) {
          pageText += `COMPARISON MATRIX:\n`;
          pageText += p.tableData.headers.join(' | ') + '\n';
          pageText += p.tableData.headers.map(() => '--------').join(' | ') + '\n';
          p.tableData.rows.forEach((r) => {
            pageText += r.join(' | ') + '\n';
          });
          pageText += '\n';
        }

        return pageText;
      })
      .join('\n\n');

    const footer = `\n================================================================================
Downloaded securely via StudyVault - College Peer Knowledge Exchange
Protect your academic integrity. For study and reference purposes only.
================================================================================`;

    const fullContent = header + body + footer;
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = material.fileName.replace(/\.pdf$/i, '.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    resolve();
  });
}
