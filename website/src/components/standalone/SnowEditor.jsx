import Editor from '../Editor';

const SnowEditor = ({ children }) => (
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
    >
      {children}
    </Editor>
  </div>
);

export default SnowEditor;
