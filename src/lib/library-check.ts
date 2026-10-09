import { getCollection } from 'astro:content';
import { emailTexts, formFree, workflowFieldRefs } from './library';

// Fails the build when a workflow uses a field that is not in the dictionary or not in its own `fields` list
// (in conditions and in {{fields}} in emails), when an email has a "u" outside a {u|je} choice,
// or when a workflow sits in a folder that does not match its phase.
export async function assertLibrary() {
  const [workflows, fields] = await Promise.all([getCollection('workflows'), getCollection('fields')]);
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
  if (errors.length) throw new Error(`Workflow library check failed:\n${errors.join('\n')}`);
}
