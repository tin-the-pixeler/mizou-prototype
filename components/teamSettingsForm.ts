// components/teamSettingsForm.ts
// Team Settings tab: editable team name + Save changes, and a Delete team
// danger zone.
// Figma: Teams - Team Settings (node 15183:256867)

import { createButton } from './button';

export type TeamSettingsFormOptions = {
  teamName: string;
  onSave?: (name: string) => void;
  onDelete?: () => void;
};

export function createTeamSettingsForm({
  teamName,
  onSave,
  onDelete,
}: TeamSettingsFormOptions): HTMLElement {
  const form = document.createElement('div');
  form.className = 'tsf';

  // ── Team Name field ──
  const nameField = document.createElement('div');
  nameField.className = 'tsf__field';

  const nameLabel = document.createElement('label');
  nameLabel.className = 'tsf__label';
  nameLabel.textContent = 'Team Name';
  nameLabel.htmlFor = 'tsf-team-name';
  nameField.appendChild(nameLabel);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'tsf-team-name';
  nameInput.className = 'tsf__input';
  nameInput.value = teamName;
  nameField.appendChild(nameInput);

  form.appendChild(nameField);

  // ── Actions ──
  const actions = document.createElement('div');
  actions.className = 'tsf__actions';
  const saveBtn = createButton({ label: 'Save changes', variant: 'primary', size: 'sm' });
  saveBtn.addEventListener('click', () => onSave?.(nameInput.value));
  actions.appendChild(saveBtn);
  form.appendChild(actions);

  // ── Divider ──
  const divider = document.createElement('hr');
  divider.className = 'tsf__divider';
  form.appendChild(divider);

  // ── Delete team ──
  const deleteSection = document.createElement('div');
  deleteSection.className = 'tsf__delete';

  const deleteTitle = document.createElement('p');
  deleteTitle.className = 'tsf__delete-title';
  deleteTitle.textContent = 'Delete team';
  deleteSection.appendChild(deleteTitle);

  const deleteBody = document.createElement('p');
  deleteBody.className = 'tsf__delete-body';
  deleteBody.textContent =
    'This will permanently remove all sessions and feedback associated with this team. Your members will also lose access to all simulations within it. This action cannot be undone—please proceed with caution.';
  deleteSection.appendChild(deleteBody);

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'tsf__delete-btn';
  deleteBtn.textContent = 'Continue with deletion';
  if (onDelete) deleteBtn.addEventListener('click', onDelete);
  deleteSection.appendChild(deleteBtn);

  form.appendChild(deleteSection);

  return form;
}
