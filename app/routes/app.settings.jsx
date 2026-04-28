import { useState } from "react";
import { useLoaderData, useSubmit } from "react-router"; 
import prisma from "../db.server";

export const loader = async ({ request }) => {
  let settingsData = await prisma.appSettings.findFirst();

  if (!settingsData) {
    settingsData = { name: "My App", description: "A simple React app" };
  }

  console.log("DATA FETCHED IN LOADER:", settingsData);
  return Response.json({ settingsData }); 
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  
  const existing = await prisma.appSettings.findFirst();

  if (existing) {
    await prisma.appSettings.update({
      where: { id: existing.id },
      data: { name, description },
    });
  } else {
    await prisma.appSettings.create({
      data: { name, description },
    });
  }

  console.log("DATA SAVED IN ACTION:", { name, description });
  return Response.json({ success: true }); 
};

export default function SettingsPage() {
  const { settingsData } = useLoaderData();
  const [formstate, setFormState] = useState(settingsData);
  
  const submit = useSubmit();

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", formstate.name);
    formData.append("description", formstate.description);
    submit(formData, { method: "post" });
  };

  return (
    <s-page>
      <div style={{ display: 'flex', gap: '16px' }}>
        
        <div style={{ flex: '2', minWidth: '200px' }}>
          <s-block-stack gap="200">
            <s-text as="h2" variant="headingMd">
              Settings
            </s-text>
            <s-text as="p" variant="bodyMd">
              Update app settings and preferences.
            </s-text>
          </s-block-stack>
        </div>

        <div style={{ flex: '5' }}>
          <s-card>
            <s-block-stack gap="400">
              <s-text-field 
                label="App name" 
                value={formstate.name} 
                onChange={(event) => setFormState({...formstate, name: event.target.value})}
              />
              <s-text-field 
                label="Description" 
                value={formstate.description} 
                onChange={(event) => setFormState({...formstate, description: event.target.value})} 
                multiline={4} 
              />
              
              <s-button variant="primary" onClick={handleSave}>
                Save
              </s-button>

            </s-block-stack>
          </s-card>
        </div>

      </div>
    </s-page>
  );
}