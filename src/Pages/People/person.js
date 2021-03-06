import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Announcement from "../../Components/Announcement";
import Person from "../../Components/Person";
import Post from "../../Components/Post";
import { supabase } from "../../supabaseClient";

function PersonProfile(props) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState(false);
  const [posts, setPosts] = useState(null);
  const { username } = useParams();

  const fetchProfile = useCallback(() => {
    console.log("fetch")

    const fetchUserAndPosts = async () => {
      const response = await supabase.from("profiles").select("*").filter('username', 'eq', username);
      if (response.data.length === 0) {
        setError("No such user.");
        return;
      }
      const data = response.data[0];
      setUser(data);
      supabase.rpc("get_user_posts", { profilename: username })
        .then(data => {
          setLoading(false);
          setPosts(data.data);
        });
      supabase.from("follows").select("*").filter('follower', 'eq', supabase.auth.user().id).filter('followee', 'eq', data.id)
        .then(data => {
          if (data.data.length === 0) setFollowed(false)
          else setFollowed(true);
        });
    }
    fetchUserAndPosts();
  }, [username]);

  useEffect(() => {
    setError(null);
    setLoading(true);
    setFollowed(false);
    fetchProfile();
  }, [username, fetchProfile]);

  if (error) return (
    <Announcement message={error} />
  )

  if (loading) return (
    <div>
      <Person loading />
      <Post loading />
      <Post loading />
    </div>
  );

  return (
    <div>
      <Person {...user} onPage followed={followed} />
      {
        posts && posts.map(post => <Post key={post.id} {...post} onDelete={fetchProfile} />)
      }
    </div>
  );
}

export default PersonProfile;