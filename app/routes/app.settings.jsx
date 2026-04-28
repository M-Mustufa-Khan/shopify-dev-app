import { useState } from "react";
import { useLoaderData, useSubmit } from "react-router"; 
// 1. LOADER: Runs when the page loads to fetch initial data

export const loader = async ({ request }) => {
  let settingsData = {
    name: "My App",
    description: "A simple React app"
  };
  return Response.json({ settingsData }); 
};

// 2. ACTION: Runs when you click Save
export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  
  console.log("DATA RECEIVED IN ACTION:", { name, description });
  return Response.json({ success: true }); 
};

// 3. COMPONENT: What the user sees
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
            <br />
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