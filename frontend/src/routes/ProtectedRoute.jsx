import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {

    const { token, role } = useContext(authContext);
    // console.log(role)
    // console.log(token)
    // console.log(allowedRoles)
    const isAllowed = allowedRoles.includes(role);
    // const accessibleRoute = token && isAllowed ? children : <Navigate to='/login' replace={true} />;

    // return accessibleRoute;
    // console.log(token && isAllowed)
    if (token && isAllowed) {
        return children;
    } else {
        return <Navigate to='/login' replace={true} />;
    }

}

export default ProtectedRoute
