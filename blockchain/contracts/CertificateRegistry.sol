// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateRegistry is AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    error CertificateAlreadyExists();
    error CertificateNotFound();
    error CertificateAlreadyRevoked();
    error InvalidAddress();

    struct Certificate {
        string certificateId;
        bytes32 documentHash;
        string ipfsCid;
        uint256 issuedAt;
        address issuedBy;
        bool revoked;
        uint256 revokedAt;
    }

    mapping(string => Certificate) private certificatesById;
    mapping(bytes32 => string) private certificateIdByHash;

    event CertificateIssued(
        string indexed certificateId,
        bytes32 indexed documentHash,
        address indexed issuedBy,
        string ipfsCid,
        string candidateName,
        string courseName,
        string issuerName
    );
    event CertificateRevoked(string indexed certificateId, bytes32 indexed documentHash, address indexed revokedBy);
    event IssuerAuthorized(address indexed account);
    event IssuerRevoked(address indexed account);

    constructor(address admin) {
        if (admin == address(0)) revert InvalidAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
    }

    function authorizeIssuer(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (account == address(0)) revert InvalidAddress();
        grantRole(ISSUER_ROLE, account);
        emit IssuerAuthorized(account);
    }

    function revokeIssuer(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(ISSUER_ROLE, account);
        emit IssuerRevoked(account);
    }

    function issueCertificate(
        string calldata certificateId,
        bytes32 documentHash,
        string calldata ipfsCid,
        string calldata candidateName,
        string calldata courseName,
        string calldata issuerName,
        uint256 issuedAt
    ) external onlyRole(ISSUER_ROLE) {
        if (_exists(certificateId) || bytes(certificateIdByHash[documentHash]).length != 0) {
            revert CertificateAlreadyExists();
        }

        certificatesById[certificateId] = Certificate({
            certificateId: certificateId,
            documentHash: documentHash,
            ipfsCid: ipfsCid,
            issuedAt: issuedAt,
            issuedBy: msg.sender,
            revoked: false,
            revokedAt: 0
        });

        certificateIdByHash[documentHash] = certificateId;

        emit CertificateIssued(certificateId, documentHash, msg.sender, ipfsCid, candidateName, courseName, issuerName);
    }

    function revokeCertificate(string calldata certificateId) external onlyRole(ISSUER_ROLE) {
        if (!_exists(certificateId)) revert CertificateNotFound();

        Certificate storage certificate = certificatesById[certificateId];
        if (certificate.revoked) revert CertificateAlreadyRevoked();

        certificate.revoked = true;
        certificate.revokedAt = block.timestamp;

        emit CertificateRevoked(certificateId, certificate.documentHash, msg.sender);
    }

    function getCertificate(string calldata certificateId) external view returns (Certificate memory) {
        if (!_exists(certificateId)) revert CertificateNotFound();
        return certificatesById[certificateId];
    }

    function verifyCertificateById(string calldata certificateId) external view returns (bool isValid, Certificate memory certificate) {
        if (!_exists(certificateId)) revert CertificateNotFound();
        certificate = certificatesById[certificateId];
        isValid = !certificate.revoked;
    }

    function verifyCertificateByHash(bytes32 documentHash) external view returns (bool isValid, Certificate memory certificate) {
        string memory certificateId = certificateIdByHash[documentHash];
        if (bytes(certificateId).length == 0) revert CertificateNotFound();

        certificate = certificatesById[certificateId];
        isValid = !certificate.revoked;
    }

    function certificateExists(string calldata certificateId) external view returns (bool) {
        return _exists(certificateId);
    }

    function getCertificateIdByHash(bytes32 documentHash) external view returns (string memory) {
        return certificateIdByHash[documentHash];
    }

    function _exists(string calldata certificateId) private view returns (bool) {
        return bytes(certificatesById[certificateId].certificateId).length != 0;
    }
}
