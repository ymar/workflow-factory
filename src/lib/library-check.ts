import { getCollection } from 'astro:content';
import { emailTexts, formFree, workflowFieldRefs } from './library';
import { tracks } from './tracks';

// Fails the build when a workflow uses a field that is not in the dictionary or not in its own `fields` list
// (in conditions and in {{fields}} in emails), when an email has a "u" outside a {u|je} choice,
// when a workflow sits in a folder that does not match its phase, when a workflow has no track or a number in its outcome,
// or when a sector (segment) points to a workflow, field or term that does not exist.
export async function assertLibrary() {
  const [workflows, fields, segments] = await Promise.all([getCollection('workflows'), getCollection('fields'), getCollection('segments')]);
  const dictionary = new Set(fields.map((f) => f.id));
  const errors: string[] = [];
  for (const j of workflows) {
    const listed = new Set(j.data.fields.map((f) => f.id));
    for (const id of j.data.fields.map((f) => f.id)) if (!dictionary.has(id)) errors.push(`${j.id}: field "${id}" is not in the dictionary`);
    for (const id of workflowFieldRefs(j)) {
      if (!dictionary.has(id)) errors.push(`${j.id}: uses "${id}", which is not in the dictionary`);
      else if (!listed.has(id)) errors.push(`${j.id}: uses "${id}" but does not list it under fields`);
    }
    // Every "u" in an email must be a {u|je} choice, so switching the form of address never leaves one behind.
    for (const s of j.data.steps) {
      for (const text of emailTexts(s)) {
        const stray = formFree(text).match(/\b(u|uw|U|Uw)\b/);
        if (stray) errors.push(`${j.id} ${s.id}: write "${stray[0]}" as a {u|je} choice in the email`);
      }
    }
    const folder = j.filePath?.split('/').at(-2);
    if (folder && folder !== j.data.phase) errors.push(`${j.id}: sits in folder "${folder}" but has phase "${j.data.phase}"`);
  }

  const workflowIds = new Set(workflows.map((w) => w.id));
  for (const j of workflows) {
    if (!tracks.some((t) => t.id === j.data.track)) errors.push(`${j.id}: has no valid track`);
    // Numbers belong in the example ("Stel: ..."), never in the outcome.
    for (const [part, text] of Object.entries(j.data.outcome)) {
      if (/[0-9€%]/.test(text)) errors.push(`${j.id}: outcome.${part} contains a number. Put numbers in the example, starting with "Stel:"`);
    }
    if (j.data.example && !j.data.example.startsWith('Stel:')) errors.push(`${j.id}: the example must start with "Stel:"`);
  }
  for (const t of tracks) {
    if (!workflows.some((j) => j.data.track === t.id)) errors.push(`track "${t.id}" has no workflows`);
  }
  for (const seg of segments) {
    if (seg.data.slug !== seg.id) errors.push(`${seg.id}: slug "${seg.data.slug}" must equal the file name`);
    if (!seg.data.statement.line.startsWith('We helpen')) errors.push(`${seg.id}: statement.line must start with "We helpen"`);
    const listed = new Set(seg.data.workflows.map((w) => w.id));
    for (const id of listed) {
      if (!workflowIds.has(id)) errors.push(`${seg.id}: workflow "${id}" does not exist`);
      else if (!workflows.find((w) => w.id === id)!.data.segments.includes(seg.id as never)) errors.push(`${seg.id}: lists "${id}", but that workflow does not list ${seg.id} under segments`);
    }
    for (const j of workflows) {
      if (j.data.segments.includes(seg.id as never) && !listed.has(j.id)) errors.push(`${seg.id}: ${j.id} lists this sector, but the sector does not list the workflow`);
    }
    for (const id of Object.keys(seg.data.terms)) if (!workflowIds.has(id)) errors.push(`${seg.id}: term for "${id}", which is not a workflow`);
    for (const g of seg.data.glossary) {
      if (g.field && !dictionary.has(g.field.id)) errors.push(`${seg.id}: glossary "${g.term}" uses field "${g.field.id}", which is not in the dictionary`);
      if (g.workflow && !workflowIds.has(g.workflow.id)) errors.push(`${seg.id}: glossary "${g.term}" uses workflow "${g.workflow.id}", which does not exist`);
    }
  }
  if (errors.length) throw new Error(`Workflow library check failed:\n${errors.join('\n')}`);
}
