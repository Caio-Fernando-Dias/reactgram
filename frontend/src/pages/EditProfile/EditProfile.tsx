import type { ChangeEvent, FormEvent } from "react";
import "./EditProfile.css";

import { uploads } from "../../utils/config";
import type { RootState, AppDispatch } from "../../store";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { profile, resetMessage, updateProfile } from "../../slices/userSlice";

// Components
import Message from "../../components/Message";

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, message, error, loading } = useSelector(
    (state: RootState) => state.user,
  );

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profileImage, setImageProfile] = useState<File>();
  const [bio, setBio] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<File>();

  // Load user date
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  // Fill form with user data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    const userData = new FormData();

    userData.append("name", name);

    if (profileImage) {
      userData.append("profileImage", profileImage);
    }

    if (bio) {
      userData.append("bio", bio);
    }

    if (password) {
      userData.append("password", password);
    }

    await dispatch(updateProfile(userData));

    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    // image preview
    const image = e.target.files ? e.target.files[0] : null;

    if (!image) return;

    setPreviewImage(image);

    // update image state
    setImageProfile(image);
  };

  return (
    <div id="edit-profile">
      <h2>Edite seus dados</h2>
      <p className="subtitle">
        Adicione uma imagem de perfil e conte mais sobre você...
      </p>
      {(user.profileImage || previewImage) && (
        <img
          className="profile-image"
          src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : `${uploads}/users/${user.profileImage}`
          }
          alt={user.name}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
          value={name || ""}
        />
        <input type="email" placeholder="E-mail" disabled value={email || ""} />
        <label>
          <span>Imagem de perfil</span>
          <input type="file" onChange={handleFile} />
        </label>
        <label>
          <span>Bio:</span>
          <input
            type="text"
            placeholder="descrição de perfil"
            onChange={(e) => setBio(e.target.value)}
            value={bio || ""}
          />
        </label>
        <label>
          <span>Quer alterar senha?</span>
          <input
            type="password"
            placeholder="Digite sua nova senha"
            onChange={(e) => setPassword(e.target.value)}
            value={password || ""}
            autoComplete="Senha"
          />
        </label>
        {!loading && <input type="submit" value="Atualizar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </form>
    </div>
  );
};

export default EditProfile;
