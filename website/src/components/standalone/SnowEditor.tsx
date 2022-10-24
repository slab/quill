import Editor from '../Editor';

const SnowEditor = () => (
  <div
    className="standalone-container"
    style={{ margin: '50px auto', maxWidth: 720 }}
  >
    <Editor
      style={{ height: 350 }}
      config={{
        placeholder: 'Compose an epic...',
        theme: 'snow',
      }}
    />
  </div>
);

export default SnowEditor;
