# Makefile シェル指定
SHELL=/bin/bash
###################################################################################
#########################          Variables          #############################
###################################################################################

# ログの色
R := \e[31m
G := \e[32m
B := \e[34m
N := \e[0m


# 暗号化
.PHONE: env.encrypt
env.encrypt:
	@make _env.encrypt KEY=$(KEY) INPUT=./env/decrypt/.env OUTPUT=./env/encrypt/.env

# 復号
.PHONE: env.decrypt
env.decrypt:
	@make _env.decrypt KEY=$(KEY) INPUT=./env/encrypt/.env OUTPUT=./env/decrypt/.env


###################################################################################
#########################          Methods          ###############################
###################################################################################


_env.backup:
	@if [ -e $(FILE) ]; then cp $(FILE) $(FILE).backup.$(shell date +%Y%m%d_%H%M%S); fi

_env.encrypt:
	@make _env.backup FILE=$(INPUT)
	@make _env.backup FILE=$(OUTPUT)
	@if [ -n "$(KEY)" ]; then\
		openssl aes-256-cbc -e -in $(INPUT) -pass pass:$(KEY) | base64 > $(OUTPUT);\
		printf '${B}%s\n' "Key encrypted. →→→ $(OUTPUT) ";\
	else\
		printf '${R}%s\n' "you need to set KEY[local | pro]";\
	fi

_env.decrypt:
	@make _env.backup FILE=$(INPUT)
	@make _env.backup FILE=$(OUTPUT)
	@if [ -n "$(KEY)" ]; then\
		cat $(INPUT) | base64 -d | openssl aes-256-cbc -d -out $(OUTPUT) -pass pass:$(KEY);\
		printf '${B}%s\n' "Key decrypted. →→→ $(OUTPUT) ";\
	else\
		printf '${R}%s\n' "you need to set KEY[local | pro]";\
	fi
